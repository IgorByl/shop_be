import { handlerPath } from '.';

describe('HandlerPath function', () => {
  const path = 'C:\\User\\some_path';
  const directorySpy = jest.spyOn(process, 'cwd');
  directorySpy.mockReturnValue(path);

  it('should resolve path correct', () => {
    const resultPath = handlerPath(`${path}\\src`);
    expect(resultPath).toBe('src');
  });
});
