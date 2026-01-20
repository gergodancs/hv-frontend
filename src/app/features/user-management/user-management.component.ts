import {Component, inject} from '@angular/core';
import {UserCreateDTO, UserDTO, UsersService} from '../../api/generated';
import {ButtonModule} from 'primeng/button';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, ToastModule, TranslatePipe],
  providers: [MessageService],
})
export class UserManagementComponent {

  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private messageService = inject(MessageService);

  usersForm = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    username: ['', [Validators.required]],
    role: ['', [Validators.required]],
  });


  onSubmit(): void {
    if(this.usersForm.valid) {
      const newUser = this.usersForm.value as UserCreateDTO;
      this.usersService.createUser(newUser).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Siker', detail: 'Hibajegy mentve!' });
          this.usersForm.reset();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Nem sikerült a mentés.' });
        }
      });
    }

  }
}
