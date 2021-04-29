import SoundPlayer from './soundPlayer';

export default class SoundPlayerConsumer {
  soundPlayer = new SoundPlayer();

  playSomethingCool() {
    const coolSoundFileName = 'song.mp3';
    this.soundPlayer.playSoundFile(coolSoundFileName);
  }
}