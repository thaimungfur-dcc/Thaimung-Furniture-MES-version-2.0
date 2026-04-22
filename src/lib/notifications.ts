import Swal, { SweetAlertOptions } from 'sweetalert2';

/**
 * ระบบแจ้งเตือน SweetAlert2 มาตรฐานสำหรับทั้งโปรเจกต์
 */
export const notify = {
  success: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'success',
      title: title.toUpperCase(),
      text,
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
      background: '#fff',
      color: '#111f42',
      customClass: {
        popup: 'rounded-[32px] border border-slate-100 shadow-2xl',
        title: 'font-black tracking-widest text-[#111f42]',
      }
    });
  },

  error: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'error',
      title: 'ERROR: ' + title.toUpperCase(),
      text,
      confirmButtonColor: '#111f42',
      background: '#fff',
      color: '#111f42',
      customClass: {
        popup: 'rounded-[32px] border border-slate-100 shadow-2xl',
        title: 'font-black tracking-widest text-rose-500',
        confirmButton: 'rounded-xl px-8 py-3 font-black uppercase tracking-widest'
      }
    });
  },

  warning: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'warning',
      title: title.toUpperCase(),
      text,
      confirmButtonColor: '#ab8a3b',
      background: '#fff',
      color: '#111f42',
      customClass: {
        popup: 'rounded-[32px] border border-slate-100 shadow-2xl',
        title: 'font-black tracking-widest text-[#ab8a3b]',
      }
    });
  },

  confirm: (title: string, text: string, confirmText: string = 'YES, CONFIRM') => {
    return Swal.fire({
      title: title.toUpperCase(),
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#111f42',
      cancelButtonColor: '#E3624A',
      confirmButtonText: confirmText,
      background: '#fff',
      color: '#111f42',
      customClass: {
        popup: 'rounded-[40px] border border-slate-100 shadow-2xl',
        title: 'font-black tracking-[0.2em]',
        confirmButton: 'rounded-2xl px-8 py-4 font-black uppercase tracking-widest mx-2',
        cancelButton: 'rounded-2xl px-8 py-4 font-black uppercase tracking-widest mx-2'
      }
    });
  },

  loading: (title: string = 'PROCESSING...') => {
    Swal.fire({
      title: title.toUpperCase(),
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#fff',
      color: '#111f42',
      customClass: {
        popup: 'rounded-[32px] border border-slate-100 shadow-2xl',
        title: 'font-black tracking-[0.3em]',
      }
    });
  },

  close: () => {
    Swal.close();
  }
};
