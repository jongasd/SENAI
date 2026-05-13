t = [-10, -8, 0,1,2,5,-2,-4]
t.sort()
media = sum(t) / len(t)
print("A menor temperatura foi", t[0]) 
print("A maior temperatura foi", t[len(t)-1])
print("A media das temperaturas foi", media)
