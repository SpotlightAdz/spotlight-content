import json,sys,base64,re
src,out=sys.argv[1],sys.argv[2]
arr=json.load(open(src))
for it in arr:
    t=it.get("text","")
    try: d=json.loads(t)
    except Exception: continue
    def find(o):
        if isinstance(o,dict):
            for k,v in o.items():
                if isinstance(v,str) and len(v)>10000: return k,v,o
                r=find(v)
                if r: return r
    r=find(d)
    if r:
        k,v,o=r
        print({kk:(vv if not isinstance(vv,str) or len(vv)<300 else '...') for kk,vv in o.items()})
        open(out,"wb").write(base64.b64decode(v)); print("wrote",out)
