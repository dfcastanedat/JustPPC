def solve():
    s = raw_input()
    if len(s) == 1:
        return True

    for i in xrange(len(s) - 1):
        if s[i] == 'a' and s[i + 1] == 'z':
            continue
        if s[i] == 'z' and s[i + 1] == 'a':
            continue

        if abs(ord(s[i]) - ord(s[i + 1])) != 1:
            return False
    return True


t = input()
for i in xrange(t):
    if solve():
        print
        "YES"
    else:
        print
        "NO"
