def is_allowed_to_participate(birth_year, uni_admission, done_semesters, final_participations, regional_participations):
  should_apply_rule_5 = False

  if final_participations >= 2:
    return '-'
  if regional_participations >= 6:
    return '-'
  if regional_participations == 5:
    should_apply_rule_5 = True
  if birth_year < 2002 and uni_admission < 2021:
    should_apply_rule_5 = True
  if should_apply_rule_5 and done_semesters >= 9:
    return '-'
  if should_apply_rule_5 and done_semesters <= 8:
    return '?'
  return '+'


birth_year = int(input()) # 1995 - 2011
uni_admission = int(input()) # 2012 - 2025
done_semesters = int(input()) # 0 <= 12
final_participations = int(input()) # 0 <= 3
regional_participations = int(input()) #  final_participations <= regional_participations <= 7
print(is_allowed_to_participate(birth_year, uni_admission, done_semesters, final_participations, regional_participations))
