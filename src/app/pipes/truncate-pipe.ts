import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(url: string | null | undefined): SafeResourceUrl {
    if (!url) {
      return ''; 
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
