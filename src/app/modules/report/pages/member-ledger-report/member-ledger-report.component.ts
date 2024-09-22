import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MemberLedgerReportService } from '../../services/member-ledger-report.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DateConverter } from 'src/app/_metronic/kt/_utils/DateConverter';
import { EmailLedgerReportService } from '../../services/email-ledger-report.service';

@Component({
  selector: 'app-member-ledger-report',
  standalone: false,
  templateUrl: './member-ledger-report.component.html',
  styleUrl: './member-ledger-report.component.scss',
})
export class MemberLedgerReportComponent implements OnInit {
  pdfSrc: any;
  detail: boolean = false;
  filterForm: FormGroup;
  eventList: any;
  spin: boolean = false;
  member: any;
  constructor(
    private _service: EmailLedgerReportService,
    private formBuilder: FormBuilder,
    private _alert: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.createFilterForm();
    this.detail = true;
  }
  setReportFilterSection(x) {
    if (x === 1) {
      this.detail = true;
    }
    if (x === 2) {
      this.detail = false;
    }
  }
  createFilterForm() {
    const today = new Date();
    const currentDate: NgbDateStruct = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
    this.filterForm = this.formBuilder.group({
      fromDate: currentDate,
      toDate: currentDate,
      membershipNo: '',
    });
  }
  url: any;
  viewPdfReport() {
    var reportType = 'PDF';
    this.pdfSrc = null;
    if (this.filterForm.value.fromDate) {
      this.filterForm.value.fromDate = new DateConverter().dateModal(
        this.filterForm.value.fromDate
      );
    }
    if (this.filterForm.value.toDate) {
      this.filterForm.value.toDate = new DateConverter().dateModal(
        this.filterForm.value.toDate
      );
    }
    this.spin = true;
    if (this.detail) {
      this._service
        .getMemberLedgerDetailReport(
          this.filterForm.value.fromDate,
          this.filterForm.value.toDate,
          this.filterForm.value.membershipNo
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
    } else {
      this._service
        .getMemberLedgerSummaryReport(
          this.filterForm.value.fromDate,
          this.filterForm.value.toDate,
          this.filterForm.value.membershipNo
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
    this.filterForm.reset();
  }
}
