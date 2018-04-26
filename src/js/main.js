class App{

  constructor(_name){
    this.appName = _name;
  }

  get AppName() {
    return this.appName;
  }

  set AppName(_name){
    this.appName = _name;
  }
}

const APP = new App('Super App');
let title = document.getElementById('title');

title.textContent = APP.AppName;
