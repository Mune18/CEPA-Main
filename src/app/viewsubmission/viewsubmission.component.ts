import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-viewsubmission',
  standalone: true,
  imports: [ FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
  MatGridListModule],
  templateUrl: './viewsubmission.component.html',
  styleUrl: './viewsubmission.component.css'
})
export class ViewsubmissionComponent {
  status: string = 'pending';
  characterCount: number = 0;

  onStatusChange(event: any) {
    this.status = event.value;
  }

  onCharacterCountChange(event: any) {
    this.characterCount = event.target.value.length;
  }

  onSave() {
    console.log('Save button clicked');
  }


}
