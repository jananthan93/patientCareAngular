import { Component } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Patient } from './patient.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CarePatient';
  description = 'CarePerson With Patients';
  greeting;
  name: string;
  greetings: string[] = [];

  patientObjs:Patient[];
  patientObj:Patient=new Patient();
 patients:Patient[];
  disabled = true;
  id:number;
  pId:number;
  private stompClient = null;

  constructor() { }
  ngOnInit() {
    
  }
  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (!connected) {
      this.patients = [];
      this.patientObjs=[];
      this.patientObj=null;
    }
  }
  
  connect() {
    const socket = new SockJS('http://localhost:8080/care');
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function (sampleframe) {
      _this.setConnected(true);
      console.log('Connected: ' + sampleframe);
      _this.send();

      // _this.stompClient.subscribe('/sendtopic/hi', function (user) {
      //   _this.showGreeting(JSON.parse(user.body).greeting);
        
      // });

      // _this.stompClient.subscribe('/sendtopic/hi', function (hello) {
      //   _this.showGreeting(JSON.parse(hello.body).greeting);
        
      // });

      _this.stompClient.subscribe('/sendtopic/patient', function (patient) {
        _this.showCarePatients(JSON.parse(patient.body));
        
      });
      _this.stompClient.subscribe('/sendtopic/person', function (Onepatient) {
        _this.showPatientsByUserId(JSON.parse(Onepatient.body));
        
      });
      _this.stompClient.subscribe('/sendtopic/Onepatient', function (Onepatient) {
        _this.showOnePatient(JSON.parse(Onepatient.body));
        
      });
    });
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }

    this.setConnected(false);
    console.log('Disconnected!');
  }

   sendId() {
    this.stompClient.send(
      '/receivetopic/helloPerson',
      {},
      JSON.stringify({ id:this.id})
      
    );
    
    
  }
  sendIdAndPatientId() {
    this.stompClient.send(
      '/receivetopic/helloOneperson',
      {},
      JSON.stringify({ id:this.id,patientId:this.pId})
      
    );
   
  }
  send() {
    this.stompClient.send(
      '/receivetopic/hellocare',
      {},
      JSON.stringify({ 'name': this.name ,'id':this.id})
    );

  }

  // showGreeting(message) {
  //   this.users.push(message);
  // }
  showPatientsByUserId(message) {
    this.patientObjs=message;
  }
  showCarePatients(message) {
    this.patients=message;
  }
  showOnePatient(message) {
    this.patientObj=message;
  }
}
