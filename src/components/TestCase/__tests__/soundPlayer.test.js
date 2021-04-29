import SoundPlayer from "../soundPlayer";
import SoundPlayerConsumer from "../soundPlayerConsumer";
jest.mock('../soundPlayer');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods
  SoundPlayer.mockClear();
});

it.skip('We can check if the consumer called the class constructr', () => {
  const spc = new SoundPlayerConsumer();
  expect(SoundPlayer).toHaveBeenCalledTimes(1);
});

it.skip('We cha check if the consumer called a methdo on the class instance', () => {
  expect(SoundPlayer).not.toHaveBeenCalled();

  const spc = new SoundPlayerConsumer();
  expect(SoundPlayer).toHaveBeenCalledTimes(1);

  const coolSoundFileName = 'song.mp3';
  spc.playSomethingCool();

  const mockSoundPlayerInstance = SoundPlayer.mock.instances[0];
  const mockPlaySoundFile = mockSoundPlayerInstance.playSoundFile;

  expect(mockPlaySoundFile.mock.calls[0][0]).toEqual(coolSoundFileName);
  expect(mockPlaySoundFile).toHaveBeenLastCalledWith(coolSoundFileName);
  expect(mockPlaySoundFile).toHaveBeenCalledTimes(1);
});