import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MemberLedgerReportService } from '../../services/member-ledger-report.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DateConverter } from 'src/app/_metronic/kt/_utils/DateConverter';

@Component({
  selector: 'app-member-attandance-report',
  standalone: false,
  templateUrl: './member-attandance-report.component.html',
  styleUrl: './member-attandance-report.component.scss',
})
export class MemberAttandanceReportComponent implements OnInit {
  pdfSrc: any;
  filterForm: FormGroup;
  spin: boolean = false;
  IsAllMember: boolean = true;
  member: any;
  constructor(
    private _service: MemberLedgerReportService,
    private formBuilder: FormBuilder,
    private _alert: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.createFilterForm();
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
      memberNo: '',
    });
  }
  url: any;
  viewPdfReport() {
    if (
      !this.IsAllMember &&
      (this.filterForm.value.memberNo == null ||
        this.filterForm.value.memberNo.trim() == '')
    ) {
      this.pdfSrc = null;
      this._alert.error('Please Provide a member number');
      return;
    }

    this.getMemberByMemberNo(this.filterForm.value.memberNo);
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

    this._service
      .getMemberAttendanceReport(
        this.filterForm.value.fromDate,
        this.filterForm.value.toDate,
        this.filterForm.value.memberNo
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

  getMemberByMemberNo(memberNo) {
    this.spin = true;
    this._service.getMemberInfoByMemberShipNo(memberNo).subscribe(
      (data) => {
        this.member = data;
        this.cdr.detectChanges();
        this.spin = false;
      },
      (err) => {
        this.spin = false;
      }
    );
  }
  setStatusCriteria(value) {
    this.filterForm.get('memberNo').patchValue(null);
    this.IsAllMember = value;
  }
  resetForm() {
    this.filterForm.reset();
  }
}
