import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';


export interface ITest {
  name: string;
  id?: number;
  testName: string;
  pointsPossible: number;
  pointsReceived: number;
  percentage: number;
  grade: string;
}

@Component({
  selector: 'app-test-score',
  templateUrl: './test-score.component.html',
  styleUrls: ['./test-score.component.css']
})
export class TestScoreComponent implements OnInit {
  tests: Array<ITest> = [];
  name: string;
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    const tests = JSON.parse(localStorage.getItem('tests'));
    if (tests && tests.length > 0) {
      this.tests = tests;
    } else {
      this.tests = await this.loadTestsFromJson();
    }

    console.log('this.contacts from ngOninit...', this.tests);

  }

  async loadTestsFromJson() {
    const tests = await this.http.get('assets/tests.json').toPromise();
    return tests.json();
  }

  addTest() {
    const test: ITest = {
      name: null,
      id: null,
      testName: null,
      pointsPossible: null,
      pointsReceived: null,
      percentage: null,
      grade: null
    };
    this.tests.unshift(test);
    this.saveToLocalStorage();
  }

  deleteTest(index: number) {
    this.tests.splice(index, 1);
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem('tests', JSON.stringify(this.tests));
  }

  compute() {
    console.log('from compute....');
    const data = this.calculate();
    this.router.navigate(['home', data]);
  }

  calculate() {
    if (this.name === ', ') {
      this.toastService.showToast('warning', 5000, 'Must use comma and space');
    } else {
      let pointsPossible = 0;
      let pointsReceived = 0;
      for (let i = 0; i < this.tests.length; i++) {
        pointsPossible += this.tests[i].pointsPossible;
        pointsReceived += this.tests[i].pointsReceived;
      }

      const finalPercentage = (pointsReceived / pointsPossible);
      let finalGrade: string;
      if (finalPercentage >= .90) { finalGrade = 'A'; } else
        if (finalPercentage >= .80) { finalGrade = 'B'; } else
          if (finalPercentage >= .70) { finalGrade = 'C'; } else
            if (finalPercentage >= .60) { finalGrade = 'D'; } else
              if (finalPercentage <= .59) { finalGrade = 'F'; }

      return {
        name: this.name,
        totalPointsPossible: pointsPossible,
        totalPointsReceived: pointsReceived,
        totalPercentage: finalPercentage,
        finalGrade: finalGrade
      };

    }
  }

  }
