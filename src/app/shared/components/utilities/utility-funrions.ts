export class UtilityFunctions {
  // constructor(private alertify: AlertService){

  // }
  static goTop() {
    // document.body.scrollTop = 0; // For Safari
    // document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
  }

  static setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  }

  static copyLink(link: any) {
    var el = document.createElement('textarea');
    el.value = link;
    el.setAttribute('readonly', '');
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    // this.alertify.success('Link has been copied to clipboard.');
    return true;
    // if (link !== null && link !== null && link !== '') {
    //   link.select();
    //   document.execCommand('copy');
    //   link.setSelectionRange(0, 0);
    //   this.alertify.success('Link has been copied to clipboard.');
    // }
  }
}
