time = str(input())
has_semicolon = len(time.split(':')) > 1

if (has_semicolon):
  hh, mm, ss = time.split(':')
  print(int(hh) * 60 * 60 + int(mm) * 60 + int(ss))
else:
  hh = int(time) // 3600
  mm = (int(time) - hh * 3600) // 60
  ss = int(time) - hh * 3600 - mm * 60
  pad_with_zeroes = lambda x: str(x).rjust(2, '0')
  print(f'{pad_with_zeroes(hh)}:{pad_with_zeroes(mm)}:{pad_with_zeroes(ss)}')
