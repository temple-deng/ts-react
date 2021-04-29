import SoundPlayer, { mockPlaySoundFile } from "../soundPlayer";
import SoundPlayerConsumer from "../soundPlayerConsumer";

jest.mock('../soundPlayer');

beforeEach(() => {
  SoundPlayer.mockClear();
  mockPlaySoundFile.mockClear();
});

it.skip('We can check if the consumer called the class construct', () => {
  const spc = new SoundPlayerConsumer();
  expect(SoundPlayer).toHaveBeenCalledTimes(1);
});

it.skip('We can check if the consumer called a method on the class instance', () => {
  const spc = new SoundPlayerConsumer();
  const coolName = 'song.mp3';
  spc.playSomethingCool();
  expect(mockPlaySoundFile).toHaveBeenCalledWith(coolName);
});