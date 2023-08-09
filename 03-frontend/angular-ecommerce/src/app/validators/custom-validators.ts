import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
    
    // whitespace validation
    static notOnlyWhitespace(control: FormControl): ValidationErrors {
        
        // check if string only contains whitespace 
        if((control.value != null) && (control.value.trim().length === 0)) {
            
            // 無效 回傳 error object
            // notOnlyWhitespace -> 自定義 validation error key
            return {'notOnlyWhitespace': true}
        } else {
            return null;
        }
    } 
}
