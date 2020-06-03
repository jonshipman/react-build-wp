import phone from "phone";

class StringUtil {
  isPhone = str => {
    let check =  phone(str, '', true);
    return check.length > 0;
  }

  isEmail = str => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(str);
  }

  preventHangingWords = str => {
    str = str.split(' ');
    str.splice(str.length-2, 0, '<nobr>');
    str.push('</nobr>');
    return str.join(' ');
  }

  preventPhoneNumberSpliting = str => {
    let ret = '';

    str = str.replace(') ', ')%%');

    str = str.split(' ');
    str.forEach(s => {
      if (this.isPhone(s)) {
        s = `<nobr>${s}</nobr>`;
      }

      ret += ` ${s}`;
    });

    ret = ret.replace(')%%', ') ');

    return ret;
  }
};

const _string = new StringUtil();
export const { isPhone, isEmail, preventHangingWords, preventPhoneNumberSpliting } = _string;
