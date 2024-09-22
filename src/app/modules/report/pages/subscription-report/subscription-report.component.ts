import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DateConverter } from 'src/app/_metronic/kt/_utils/DateConverter';
import { SubscriptionReportService } from '../../services/subscription-report.service';

@Component({
  selector: 'app-subscription-report',
  standalone: false,
  templateUrl: './subscription-report.component.html',
  styleUrl: './subscription-report.component.scss',
})
export class SubscriptionReportComponent implements OnInit {
  sectionNo: number;
  pdfSrc: any;
  spin: boolean = false;
  filterForm1: FormGroup;
  filterForm2: FormGroup;
  filterForm3: FormGroup;
  filterForm4: FormGroup;
  filterForm5: FormGroup;
  filterForm6: FormGroup;

  quarterList = ['Q1', 'Q2', 'Q3', 'Q4'];
  yearList = ['2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028'];
  constructor(
    private formBuilder: FormBuilder,
    private _alert: ToastrService,
    private cdr: ChangeDetectorRef,
    private _service: SubscriptionReportService
  ) {}
  ngOnInit(): void {
    this.sectionNo = 1;
    this.setReportFilterSection(this.sectionNo);
  }
  setReportFilterSection(sectionNo) {
    this.sectionNo = sectionNo;
    const today = new Date();
    const currentDate: NgbDateStruct = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
    if (this.sectionNo === 1) {
      this.filterForm1 = this.formBuilder.group({
        fromDate: currentDate,
        toDate: currentDate,
        membershipNo: null,
        year: null,
        quarter: null,
      });
    } else if (this.sectionNo === 2) {
      this.filterForm2 = this.formBuilder.group({
        fromDate: currentDate,
        toDate: currentDate,
        membershipNo: null,
        year: null,
      });
    } else if (this.sectionNo === 3) {
      this.filterForm3 = this.formBuilder.group({
        membershipNo: null,
        year: null,
        quarter: null,
      });
    } else if (this.sectionNo === 4) {
      this.filterForm4 = this.formBuilder.group({
        membershipNo: null,
        year: null,
        quarter: null,
      });
    } else if (this.sectionNo === 5) {
      this.filterForm5 = this.formBuilder.group({
        fromDate: currentDate,
        toDate: currentDate,
      });
    } else if (this.sectionNo === 6) {
      this.filterForm6 = this.formBuilder.group({
        fromDate: currentDate,
        toDate: currentDate,
      });
    }
  }

  url: any;
  viewPdfReport() {
    this.spin = true;
    var reportType = 'PDF';
    this.pdfSrc = null;
    if (this.sectionNo === 1) {
      if (this.filterForm1.value.fromDate) {
        this.filterForm1.value.fromDate = new DateConverter().dateModal(
          this.filterForm1.value.fromDate
        );
      }
      if (this.filterForm1.value.toDate) {
        this.filterForm1.value.toDate = new DateConverter().dateModal(
          this.filterForm1.value.toDate
        );
      }
      this._service
        .exportSubscriptionPaymentDetailReport(
          this.filterForm1.value.fromDate,
          this.filterForm1.value.toDate,
          this.filterForm1.value.membershipNo,
          this.filterForm1.value.year,
          this.filterForm1.value.quarter
        )
        .subscribe(
          (blobData: Blob) => {
            let documentBlob = new Blob([blobData], {
              type: reportType == 'PDF' ? 'application/pdf' : '',
            });
            this.url = URL.createObjectURL(documentBlob);
            this.spin = false;
            this.cdr.detectChanges();
          },
          (err) => {
            this.spin = false;
          }
        );
    } else if (this.sectionNo === 2) {
      if (this.filterForm2.value.fromDate) {
        this.filterForm2.value.fromDate = new DateConverter().dateModal(
          this.filterForm2.value.fromDate
        );
      }
      if (this.filterForm2.value.toDate) {
        this.filterForm2.value.toDate = new DateConverter().dateModal(
          this.filterForm2.value.toDate
        );
      }

      this._service
        .exportSubscriptionPaymentSummaryReport(
          this.filterForm1.value.fromDate,
          this.filterForm1.value.toDate,
          this.filterForm1.value.membershipNo,
          this.filterForm1.value.year
        )
        .subscribe(
          (blobData: Blob) => {
            let documentBlob = new Blob([blobData], {
              type: reportType == 'PDF' ? 'application/pdf' : '',
            });
            this.url = URL.createObjectURL(documentBlob);
            this.spin = false;
            this.cdr.detectChanges();
          },
          (err) => {
            this.spin = false;
          }
        );
    } else if (this.sectionNo === 3) {
      this._service
        .exportSubscriptionDueDetailReport(
          this.filterForm3.value.membershipNo,
          this.filterForm3.value.year,
          this.filterForm3.value.quarter
        )
        .subscribe(
          (blobData: Blob) => {
            let documentBlob = new Blob([blobData], {
              type: reportType == 'PDF' ? 'application/pdf' : '',
            });
            this.url = URL.createObjectURL(documentBlob);
            this.spin = false;
            this.cdr.detectChanges();
          },
          (err) => {
            this.spin = false;
          }
        );
    } else if (this.sectionNo === 4) {
      this._service
        .exportSubscriptionDueSummaryReport(
          this.filterForm4.value.membershipNo,
          this.filterForm4.value.year,
          this.filterForm4.value.quarter
        )
        .subscribe(
          (blobData: Blob) => {
            let documentBlob = new Blob([blobData], {
              type: reportType == 'PDF' ? 'application/pdf' : '',
            });
            this.url = URL.createObjectURL(documentBlob);
            this.spin = false;
            this.cdr.detectChanges();
          },
          (err) => {
            this.spin = false;
          }
        );
    } else if (this.sectionNo === 5) {
      if (this.filterForm5.value.fromDate) {
        this.filterForm5.value.fromDate = new DateConverter().dateModal(
          this.filterForm5.value.fromDate
        );
      }
      if (this.filterForm5.value.toDate) {
        this.filterForm5.value.toDate = new DateConverter().dateModal(
          this.filterForm5.value.toDate
        );
      }
      this._service
        .exportUserWiseSubscriptionCollectionReport(
          this.filterForm5.value.fromDate,
          this.filterForm5.value.toDate
        )
        .subscribe(
          (blobData: Blob) => {
            let documentBlob = new Blob([blobData], {
              type: reportType == 'PDF' ? 'application/pdf' : '',
            });
            this.url = URL.createObjectURL(documentBlob);
            this.spin = false;
            this.cdr.detectChanges();
          },
          (err) => {
            this.spin = false;
          }
        );
    } else if (this.sectionNo === 6) {
      if (this.filterForm6.value.fromDate) {
        this.filterForm6.value.fromDate = new DateConverter().dateModal(
          this.filterForm6.value.fromDate
        );
      }
      if (this.filterForm6.value.toDate) {
        this.filterForm6.value.toDate = new DateConverter().dateModal(
          this.filterForm6.value.toDate
        );
      }
      this._service
        .exportUserWiseSubscriptionCollectionDetailsReport(
          this.filterForm6.value.fromDate,
          this.filterForm6.value.toDate
        )
        .subscribe(
          (blobData: Blob) => {
            let documentBlob = new Blob([blobData], {
              type: reportType == 'PDF' ? 'application/pdf' : '',
            });
            this.url = URL.createObjectURL(documentBlob);
            this.spin = false;
            this.cdr.detectChanges();
          },
          (err) => {
            this.spin = false;
          }
        );
    }
  }

  resetForm() {
    if (this.sectionNo === 1) {
      this.filterForm1.reset();
    } else if (this.sectionNo === 2) {
      this.filterForm2.reset();
    }
  }
}
