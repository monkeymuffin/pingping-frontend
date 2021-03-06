import { Component, OnInit, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouteQuestionnaireService } from '../../services/route-questionnaire.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatomoTracker } from 'ngx-matomo';

@Component({
	selector: 'app-questions',
	templateUrl: './route-questionnaire.component.html',
	styleUrls: ['./route-questionnaire.component.scss']
})
export class RouteQuestionnaireComponent implements OnInit {
	questionForm: FormGroup;
	currentQuestion: any = {};
	multipleChoiceAnswer: any[] = [];
	questionPosition: any;
	progressPercentage = 0;
	days: number[];
	month: string[] = [
		'Januari',
		'Februari',
		'Maart',
		'April',
		'Mei',
		'Juni',
		'Juli',
		'Augustus',
		'September',
		'Oktober',
		'November',
		'December'
	];
	years: number[] = [];

	constructor(private questionsService: RouteQuestionnaireService,
		private route: ActivatedRoute,
		private router: Router) { }

	ngOnInit() {
		this.route.params.subscribe((params: any) => {
			this.questionPosition = this.route.snapshot.paramMap.get('questionPosition');
			this.currentQuestion.type = null;
			this.questionForm = new FormGroup({
				question: new FormControl(''),

				birthDay: new FormControl(''),
				birthMonth: new FormControl(''),
				birthYear: new FormControl(''),

				answer: new FormControl(null)
			});

			if (this.questionPosition) {
				this.questionsService.getQuestion(this.questionPosition).subscribe((response: any) => {
					this.updateProgressBar(response);

					this.currentQuestion = response;

					this.initForm(response);
				});
			} else {
				this.questionsService.getFirstQuestion().subscribe((response: any) => {
					this.router.navigate([`/route-questionnaire/${response.currentQuestion}/`]);

					localStorage.setItem('ppCookie', response.cookie);
				});
			}
		});

	}

	showInfoInConsole() {
		console.log(this.questionForm);
		console.log('Question position: ', this.questionPosition);
		// console.log('Device detector: ', {
		//   deviceInfo: this.deviceDetectorService,
		//   isMobile: this.deviceDetectorService.isMobile(),
		//   isTablet: this.deviceDetectorService.isTablet(),
		//   isDesktop: this.deviceDetectorService.isDesktop(),
		// });
	}

	setDaysArray() {
		this.questionForm.controls['birthDay'].reset();

		let daysCount: any = new Date(
			this.questionForm.controls['birthYear'].value,
			this.questionForm.controls['birthMonth'].value,
			0).getDate();

		this.days = [].constructor(daysCount);
	}

	setYearsArray() {
		const currentYear = new Date().getFullYear();

		for (let i = 1990; i <= currentYear; i++) {
			this.years.push(i);
		}
	}

	initForm(response) {
		if (response.questionType == 'date') {
			this.setYearsArray();

			this.questionForm = null;
			this.questionForm = new FormGroup({
				birthDay: new FormControl('', Validators.required),
				birthMonth: new FormControl('', Validators.required),
				birthYear: new FormControl('', Validators.required)
			});

			this.questionForm.controls['birthMonth'].valueChanges.subscribe(() => {
				this.setDaysArray();
			});
			this.questionForm.controls['birthYear'].valueChanges.subscribe(() => {
				this.setDaysArray();
			});
		} else {
			this.questionForm = new FormGroup({
				answer: new FormControl('', Validators.required)
			});
		}
	}

	sendQuestion() {
		const data: any = { answer: null };
		const ppCookie = localStorage.getItem('ppCookie');

		
		data.cookie = ppCookie;

		if (this.questionForm.value.answer) {
			data.answer = this.questionForm.value.answer;
		} else {
			data.answer = this.questionForm.value;
		}

		this.questionsService.sendQuestion(data, this.currentQuestion.currentQuestion).subscribe((response: any) => {
			if (!response.user_user_key) {
				this.router.navigate([`/route-questionnaire/${response.currentQuestion}/`]);
				localStorage.setItem('ppCookie', response.cookie);
			} else {
				localStorage.setItem('ppUserID', JSON.stringify(response.user_user_key.user_key));

				this.router.navigate(['/route-confirmation']);
			}
		});	
	}

	updateProgressBar(question: any) {
		this.progressPercentage = (100 * question.order) / question.numberOfQuestions;
	}

	prevQuestion(id: any) {
		const data: any = {};
		const ppCookie = localStorage.getItem('ppCookie');
		data.cookie = ppCookie;


		if (id == 4) {
			this.router.navigate([`/route-questionnaire/6`])
		} else {
			this.questionsService.prevQuestion(data, id).subscribe((prev: any) => {
				localStorage.setItem('ppCookie', prev.cookie)
				this.router.navigate([`/route-questionnaire/${prev.id}`])
			});
		}
	}


	onMultipleClick(event: any, answer: any) {
		if(event.target.checked) {
			if(!this.multipleChoiceAnswer.includes(answer)) {
				this.multipleChoiceAnswer.push(answer);
			}
		} else {
			if(this.multipleChoiceAnswer.includes(answer)) {
				this.multipleChoiceAnswer.splice(this.multipleChoiceAnswer.indexOf(answer), 1);
			}
		}
		this.questionForm.controls["answer"].setValue(this.multipleChoiceAnswer);
	}

}
