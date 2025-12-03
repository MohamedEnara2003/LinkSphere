import { Injectable, signal, computed, inject } from '@angular/core';
import { DomService } from '../document/dom.service';

interface SoundItem {
  audio: HTMLAudioElement;
  volume: number;
}

@Injectable({
  providedIn: 'root',
})
export class SoundService {

readonly #domService = inject(DomService);

#soundsSignal = signal<Map<string, SoundItem>>(new Map());
#mutedSignal = signal<boolean>(false);

// Computed to check if muted
readonly isMuted = computed(() => this.#mutedSignal());

  // Load sound
  loadSound(name: string, path: string, volume = 1): void {
    if (!this.#domService.isBrowser()) return;
    const audio = new Audio(path);
    audio.preload = 'auto';
    audio.volume = volume;

    const newMap = new Map(this.#soundsSignal());
    newMap.set(name, { audio, volume });
    this.#soundsSignal.set(newMap);
  }

  // Play sound by name
  play(name: string): void {
    if (this.#mutedSignal()) return;

    const soundItem = this.#soundsSignal().get(name);
    if (!soundItem) return;

    const clone = soundItem.audio.cloneNode(true) as HTMLAudioElement;
    clone.volume = soundItem.volume;
    clone.play().catch(() => {});
}

// Mute / Unmute
muteAll(): void {
this.#mutedSignal.set(true);
}

unmuteAll(): void {
this.#mutedSignal.set(false);
}

toggleMute(): void {
this.#mutedSignal.set(!this.#mutedSignal());
}

  // Set volume of specific sound
setVolume(name: string, vol: number): void {
    const newMap = new Map(this.#soundsSignal());
    const item = newMap.get(name);
    if (!item) return;
    item.audio.volume = vol;
    item.volume = vol;
    newMap.set(name, item);
    this.#soundsSignal.set(newMap);
}

}
