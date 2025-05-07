using System;

public static class Bowling {
  public static int BowlingScore(string frames) {
    Console.WriteLine($"Frames: {frames}");
    int Score = 0;
    string[] Frames = frames.Split(' ');

    // Using for instead of foreach so that we have access to the index.
    for (int i = 0; i < Frames.Length; i++) {
      string CurrentFrame = Frames[i];

      Score += CalculateFrameScore(Frames, CurrentFrame, i);
    }

    Console.WriteLine($"Final Score: {Score}");
    return Score;
  }

  public static int CalculateFrameScore(string[] frames, string currentFrame, int index) {
    if (currentFrame[0] == 'X') {
      return CalculateStrike(frames, index);

    } else if (currentFrame.Length > 1 && currentFrame[1] == '/') {
      return CalculateSpare(frames, index);

    } else {
      int localScore = 0;

      localScore += ConvertCharToNumber(currentFrame[0]);
      localScore += ConvertCharToNumber(currentFrame[1]);

      return localScore;
    }
  }

  public static int ConvertCharToNumber(char numberAsString) {
    return numberAsString - '0';
  }

  public static int CalculateStrike(string[] frames, int index) {
    int localScore = 10;

    if (index == 9) {
      localScore += handleFinalFrameEdgeCase(frames[index]);
    } else {

      localScore += CheckFutureFrameStrike(frames, index);
    }

    return localScore;
  }

  public static int CheckFutureFrameStrike(string[] frames, int index) {
    if (frames[index + 1] != null) {
      string nextFrame = frames[index + 1];
      switch (nextFrame[0]) {
      case 'X':
      case '/':
        if (index + 1 == 9) {
          return handleFinalFrameEdgeCase(frames[index + 1]);
        }
        return 10 + CheckFutureFrameSpare(frames, index + 1);
      default:
        if (nextFrame[1] == '/') {
          return 10;
        } else {
          return ConvertCharToNumber(nextFrame[0]) + ConvertCharToNumber(nextFrame[1]);
        }
      }
    }

    return 0;
  }

  public static int CalculateSpare(string[] frames, int index) {
    int localScore = 10;

    if (index == 9) {
      localScore += handleFinalFrameEdgeCase(frames[index]);
    } else {
      localScore += CheckFutureFrameSpare(frames, index);
    }

    return localScore;
  }

  public static int CheckFutureFrameSpare(string[] frames, int index) {
    if (frames[index + 1] != null) {
      string nextFrame = frames[index + 1];
      switch (nextFrame[0]) {
      case 'X':
      case '/':
        return 10;
      default:
        return ConvertCharToNumber(nextFrame[0]);
      }
    }

    return 0;
  }

  public static int handleFinalFrameEdgeCase(string frame) {
    if (frame.Contains('/')) {
      if (frame[2] != 'X') {
        return ConvertCharToNumber(frame[2]);
      } else if (frame[2] == 'X') {
        return 10;
      }
    } else if (frame[0] == 'X') {
      int localScore = 0;
      localScore += frame[1] == 'X' ? 10 : ConvertCharToNumber(frame[1]);
      localScore += frame[2] == 'X' ? 10 : ConvertCharToNumber(frame[2]);
      return localScore;
    }

    Console.WriteLine($"Error Case occured on the final frame. {frame}");
    return 0;
  }
}