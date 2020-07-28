import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { DialogService } from 'primeng/dynamicdialog';
import { CommentModalComponent, Comment } from '../comment-modal/comment-modal.component';
import { MessageService } from 'primeng/api';
import { HttpService } from '../services/http.service';
import { SocketioService } from '../services/socketio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-app-line-chart',
  templateUrl: './app-line-chart.component.html',
  styleUrls: ['./app-line-chart.component.scss'],
  providers: [DialogService, MessageService]
})
export class AppLineChartComponent implements OnInit {
  attributesText: string;
  endDate = "";
  commentList: Comment[] = [];
  subs: Subscription;
  svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  y: d3.ScaleLinear<number, number>;
  x: d3.ScaleTime<number, number>;
  height: number;
  width: number;
  constructor(
    private el: ElementRef,
    public dialogService: DialogService,
    public messageService: MessageService,
    private httpService: HttpService,
    private socketService: SocketioService
  ) {

  }
  ngOnInit() {
    // init graph
    this.init();
    // get list of comments
    this.populateComments();
    // update comments for real time update
    this.subs = this.socketService.commentsUpdated.subscribe(val => {
      this.populateComments();
      this.updateBlocks();
    })

  }

  populateComments() {
    // save comment
    this.httpService.getAllComments().subscribe(commentList => {
      this.commentList = commentList;
    }, err => {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: err.message })
    })
  }

  async init() {
    const data = await d3.csv('assets/CSVStockData.csv', (row, idx, columns) => {
      return {
        date: new Date(row.Date), price: Number(row.Close.trim())
      }
    });
    this.height = 600;
    this.width = 850;

    const minDate = d3.min(<any[]>data, (datum, idx) => datum.date);
    const maxDate = d3.max(<any[]>data, (datum, idx) => datum.date);
    const maxPrice = d3.max(<any[]>data, (datum, idx) => datum.price);

    this.y = d3.scaleLinear()
      .domain([0, maxPrice])
      .range([this.height, 0]);
    this.x = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([0, this.width]);

    const yAxis = d3.axisLeft(this.y);
    const xAxis = d3.axisBottom(this.x);

    this.svg = d3.select('svg')
      .attr('height', '100%')
      .attr('width', '100%');

    const chartGroup = this.svg.append('g')
      .attr('transform', 'translate(50,50)');

    //
    const line = d3.line()
      .x(d => this.x(<any>d["date"]))
      .y(d => this.y(<any>d["price"]));

    chartGroup.append('path').attr('d', line(<any>data))
    chartGroup.append('g').attr('class', 'x axis').attr('transform', `translate(0,${this.height})`).call(xAxis);
    chartGroup.append('g').attr('class', 'y axis').call(yAxis);

    // selection =====================>
    const selectionRect = {
      element: null,
      previousElement: null,
      currentY: 0,
      currentX: 0,
      originX: 0,
      originY: 0,
      setElement: function (ele) {
        this.previousElement = this.element;
        this.element = ele;
      },
      getNewAttributes: function () {
        let x = this.currentX < this.originX ? this.currentX : this.originX;
        let y = this.currentY < this.originY ? this.currentY : this.originY;
        let width = Math.abs(this.currentX - this.originX);
        let height = Math.abs(this.currentY - this.originY);
        return {
          x: x,
          y: y,
          width: width,
          height: height
        };
      },
      getCurrentAttributes: function () {
        // use plus sign to convert string into number
        let x = +this.element.attr("x");
        let y = +this.element.attr("y");
        let width = +this.element.attr("width");
        let height = +this.element.attr("height");
        return {
          x1: x,
          y1: y,
          x2: x + width,
          y2: y + height
        };
      },
      getCurrentAttributesAsText: function () {
        let attrs = this.getCurrentAttributes();
        return "x1: " + attrs.x1 + " x2: " + attrs.x2 + " y1: " + attrs.y1 + " y2: " + attrs.y2;
      },
      init: function (newX, newY) {
        const rectElement = this.svg.append("rect")
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", 0)
          .attr("height", 0)
          .classed("selection", true);
        this.setElement(rectElement);
        this.originX = newX;
        this.originY = newY;
        this.update(newX, newY);
      },
      update: function (newX, newY) {
        this.currentX = newX;
        this.currentY = newY;
        this.element.attr(this.getNewAttributes());
      },
      focus: function () {
        this.element
          .style("stroke", "#DE695B")
          .style("stroke-width", "2.5");
      },
      remove: function () {
        this.element.remove();
        this.element = null;
      },
      removePrevious: function () {
        if (this.previousElement) {
          this.previousElement.remove();
        }
      }
    }

    const dragStart = () => {
      console.log("dragStart");
      let p = d3.mouse(<any>this.svg);
      selectionRect.init(p[0], p[1]);
      selectionRect.removePrevious();
    }

    const dragMove = () => {
      console.log("dragMove");
      let p = d3.mouse(<any>this.svg);
      selectionRect.update(p[0], p[1]);
      this.attributesText = selectionRect.getCurrentAttributesAsText();
    }
    const clicked = () => {
    }
    const dragEnd = () => {
      console.log("dragEnd");
      let finalAttributes = selectionRect.getCurrentAttributes();
      console.dir(finalAttributes);
      if (finalAttributes.x2 - finalAttributes.x1 > 1 && finalAttributes.y2 - finalAttributes.y1 > 1) {
        console.log("range selected");
        // range selected
        d3.event.sourceEvent.preventDefault();
        selectionRect.focus();
      } else {
        console.log("single point");
        // single point selected
        selectionRect.remove();
        // trigger click event manually
        clicked();
      }



      let dragBehavior = d3.drag()
        .on("drag", dragMove)
        .on("dragstart", dragStart)
        .on("dragend", dragEnd);

      this.svg.call(dragBehavior);
      // update blocks
      this.updateBlocks();
    }
  }

  updateBlocks() {
    // display blocks using dates ==========>
    for (let c of this.commentList) {
      // here x is already the x axis time scale you have defined in your code
      let left = this.x(new Date(c.startDate));
      let right = this.x(new Date(c.endDate)); //one more day
      let wid = right - left;
      this.svg.append("rect")
        .attr("x", left)
        .attr("width", wid)
        .attr("height", this.height)
    }
  }

  onClick() {
    const ref = this.dialogService.open(CommentModalComponent, {
      header: 'Choose a Date',
      width: '60%'
    });
    ref.onClose.subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Comment', detail: 'Comment Saved' });
      this.populateComments();
    });

  }

  ngOnDestroy() {
    this.subs && this.subs.unsubscribe();
  }

}

