const TEXT_CONTENT = "Loading map data";
const DOT_DELAY_MS = 300;
export class LoadHandler {
  private loadElement : HTMLElement;
  private dotCount : number;
  private timeout : NodeJS.Timeout;
  
  constructor() {
    this.loadElement = document.getElementById("loading");
    this.dotCount = 2;
    this.timeout = setInterval(this.updateLoadElement.bind(this), DOT_DELAY_MS);
  }

  endLoadAnimation() {
    clearInterval(this.timeout);
    this.loadElement.classList.add("hidden");
  }

  displayError(data: string) {
    clearInterval(this.timeout);
    this.loadElement.textContent = "ERROR: " + data;
    this.loadElement.classList.remove("hidden");
    this.loadElement.classList.add("error");
  }

  private updateLoadElement() {
    this.dotCount++;
    this.loadElement.textContent = TEXT_CONTENT + ('.'.repeat(this.dotCount % 3 + 1));
  }
}