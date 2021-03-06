import {Directive, Input, Output} from 'angular2/core';
import {EventEmitter, ElementRef, ViewContainerRef} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/throttleTime';
import {AppConfig} from '../config';

@Directive({ selector: '[spScrollHorizontal]' })
export class TweetWallScrollHorizontal {
  @Output() reachedEnd: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private _viewContainer: ViewContainerRef
  ) { }

  @Input() set spScrollHorizontal(condition: boolean) {

    var throttled = Observable
      .fromEvent(window, 'resize')
      .throttleTime(250)
      .subscribe(() => this.adjustHeight());

    this.startScrollIntervall(AppConfig['scrollIntervall']);

    // initial adjustment
    this.adjustHeight();
  }

  private startScrollIntervall(intervall) {
    setInterval(this.scrollWall.bind(this), intervall);
  }

  private scrollWall() {
    let scrollX = window.scrollX;
    window.scroll(window.scrollX + screen.width, 0);

    if(window.scrollX == scrollX){
      this.reachedEnd.emit(true);
      window.scroll(0,0);
    }
  }

  private adjustHeight() {

    var tweetWall = this._viewContainer.element.nativeElement;
    var tweetWallPaddingTop = 8;
    var tweetWallPaddingBottom = 8;

    var windowHeight = window.innerHeight;
    var navbarHeight = document.getElementsByClassName("sp-navbar")[0]['offsetHeight'];
    var footerHeight = document.getElementsByTagName("footer")[0]['offsetHeight'];

    tweetWall.style.height = `${windowHeight - navbarHeight - footerHeight - tweetWallPaddingTop - tweetWallPaddingBottom - 1}px`;
  }
}
