// I want to record how much time I spent on a project 
// by punching in and then punching out
// The system should store the data in localStorage and retrieve it just like a Database
// The punch button will be green

function startPunch(id) {
  
}

function endPunch() {
  
}

class Punch {
  constructor(project, startTime, endTime) {
    if (arguments.length !== 0) {
      this.id = self.crypto.randomUUID();
      this.project = project;      
      this.startTime = startTime;
      this.endTime = endTime;
      this.duration = this.endTime.getTime() - this.startTime.getTime();
    } 
    else {
      this.id = self.crypto.randomUUID(); 
      this.project = project;
      this.startTime = new Date();
      this.endTime = new Date();
      this.duration = 0;
    }
  }
}