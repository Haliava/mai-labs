IPV6_BLOCK_COUNT = 8
address_parts = input().lower().split(':')
if address_parts == ['', '', '']:
  print('0000:0000:0000:0000:0000:0000:0000:0000')
  exit()

res_parts = []
has_semicolon = False
good_part_count = 0
for i in range(len(address_parts)):
  if len(address_parts[i]) > 0:
    good_part_count += 1
    res_parts.append(address_parts[i].zfill(4))
  else:
    has_semicolon = True
    res_parts.append('')

res = ':'.join(res_parts).split('::')
res_formatted = res[0] + ':' + (IPV6_BLOCK_COUNT - good_part_count) * '0000:' + res[1] if len(res) > 1 else res[0]
if res_formatted[0] == ':':
  print(res_formatted[1:])
elif res_formatted[-1] == ':':
  print(res_formatted[:-1])
else:
  print(res_formatted)
