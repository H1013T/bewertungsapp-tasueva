import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

//Verbindung frontend an backend
export interface Member {
  id: number;
  vorname: string;
  nachname: string;
  teamId: number;
}

export interface Team {
  id?: number;
  name: string;
  klasse?: string;
  Members?: Member[];
  Projects?: Project[];
}

export interface Criterion {
  id: number;
  name: string;
  maxScore: number;
  weight: number;
}

export interface Juror {
  id: number;
  name: string;
  email?: string;
}

export interface Evaluation {
  id?: number;
  score: number;
  comment?: string;
  projectId: number;
  criterionId: number;
  jurorId: number;
  createdAt?: string;
  Criterion?: Criterion;
  Juror?: Juror;
}

export interface Project {
  id?: number;
  titel: string;
  beschreibung?: string;
  praesentiertAm?: string;
  teamId: number;
  Team?: Team;
  Evaluations?: Evaluation[];
}

export interface KriteriumStatistik {
  criterionId: number;
  kriterium: string;
  maxScore: number;
  durchschnitt: number;
  anzahlBewertungen: number;
}

export interface ProjektStatistik {
  projectId: number;
  titel: string;
  kriterien: KriteriumStatistik[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  // Teams
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.url}/teams`);
  }

  getTeam(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.url}/teams/${id}`);
  }

  createTeam(team: Team): Observable<Team> {
    return this.http.post<Team>(`${this.url}/teams`, team);
  }

  updateTeam(id: number, team: Partial<Team>): Observable<Team> {
    return this.http.put<Team>(`${this.url}/teams/${id}`, team);
  }

  deleteTeam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/teams/${id}`);
  }

  // Projekte
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.url}/projects`);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.url}/projects/${id}`);
  }

  getProjectStatistik(id: number): Observable<ProjektStatistik> {
    return this.http.get<ProjektStatistik>(`${this.url}/projects/${id}/statistik`);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.url}/projects`, project);
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.url}/projects/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/projects/${id}`);
  }

  // Bewertungen
  getEvaluations(projectId?: number): Observable<Evaluation[]> {
    const query = projectId ? `?projectId=${projectId}` : '';
    return this.http.get<Evaluation[]>(`${this.url}/evaluations${query}`);
  }

  createEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${this.url}/evaluations`, evaluation);
  }
}
