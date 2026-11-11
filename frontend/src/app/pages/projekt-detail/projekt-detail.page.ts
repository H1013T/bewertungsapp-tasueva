import { Component, OnInit, inject, input, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonNote,
  IonSpinner,
  IonText,
  IonProgressBar,
} from '@ionic/angular';
import { ApiService, Project, ProjektStatistik } from '../../services/api.service';

@Component({
  selector: 'app-projekt-detail',
  templateUrl: './projekt-detail.page.html',
  styleUrls: ['./projekt-detail.page.scss'],
  imports: [
    DatePipe,
    DecimalPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonNote,
    IonSpinner,
    IonText,
    IonProgressBar,
  ],
})
export class ProjektDetailPage implements OnInit {
  private api = inject(ApiService);

  // Routenparameter :id, wird über withComponentInputBinding() gesetzt
  id = input.required<string>();

  projekt = signal<Project | null>(null);
  statistik = signal<ProjektStatistik | null>(null);
  laedt = signal(true);
  fehler = signal<string | null>(null);

  ngOnInit() {
    const id = Number(this.id());
    forkJoin({
      projekt: this.api.getProject(id),
      statistik: this.api.getProjectStatistik(id),
    }).subscribe({
      next: ({ projekt, statistik }) => {
        this.projekt.set(projekt);
        this.statistik.set(statistik);
        this.laedt.set(false);
      },
      error: (err) => {
        this.fehler.set(
          err.status === 404
            ? 'Projekt nicht gefunden.'
            : 'Projekt konnte nicht geladen werden. Läuft das Backend?',
        );
        this.laedt.set(false);
      },
    });
  }
}
