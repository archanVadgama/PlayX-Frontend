import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Environment } from '@app/shared/types';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AppTitleService {
  private appName = (environment as Environment).appName;

  constructor(private title: Title) {}

  /**
   * Sets the document title to the specified page title
   *
   * @param {string} pageTitle
   * @memberof AppTitleService
   */
  setTitle(pageTitle: string): void {
    const fullTitle = `${pageTitle} - ${this.appName}`;
    this.title.setTitle(fullTitle);
  }
}
