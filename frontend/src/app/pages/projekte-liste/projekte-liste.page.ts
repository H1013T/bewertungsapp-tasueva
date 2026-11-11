import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSpinner,
  IonText,
  IonRefresher,
  IonRefresherContent,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { peopleOutline } from 'ionicons/icons';
import { ApiService, Project } from '../../services/api.service';

@Component({
  selector: 'app-projekte-liste',
  templateUrl: './projekte-liste.page.html',
  styleUrls: ['./projekte-liste.page.scss'],
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonSpinner,
    IonText,
    IonRefresher,
    IonRefresherContent,
    IonIcon,
  ],
})
export class ProjekteListePage implements OnInit {
  private api = inject(ApiService);

  projekte = signal<Project[]>([]);
  laedt = signal(true);
  fehler = signal<string | null>(null);

  constructor() {
    addIcons({ peopleOutline });
  }

  ngOnInit() {
    this.laden();
  }

  laden(event?: CustomEvent) {
    this.fehler.set(null);
    this.api.getProjects().subscribe({
      next: (data) => {
        this.projekte.set(data);
        this.laedt.set(false);
        (event?.target as HTMLIonRefresherElement | undefined)?.complete();
      },
      error: () => {
        this.fehler.set('Projekte konnten nicht geladen werden. Läuft das Backend?');
        this.laedt.set(false);
        (event?.target as HTMLIonRefresherElement | undefined)?.complete();
      },
    });
  }
}
