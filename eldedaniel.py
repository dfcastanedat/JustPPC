N = raw_input("")
N = int(N)
 
for i in range(N):
    
    stng = raw_input("")
    flag = True
    for j in range(0,len(stng)-1):
        x = ord(stng[j])-ord(stng[j+1])
        # print x debugging xd
        if(x!=1 and x!=-1 and x!=25 and x!=-25):
            flag = False
            print "NO"
            break
    
    if(flag):
        print "YES"
