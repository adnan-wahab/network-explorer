import json
import re
import IPython

a = 'tags'
b = 'tag_relevance'
c = 'movies'

def convert (file_name):
    src = './data/tag-genome/' +  file_name + '.dat'
    dest = "./data/" + file_name + ".json"
    butt = {}

    #print(src)
    with open(src, 'r') as f:
        for line in f:
            id, name, value = line_to_trip(line)
            if int(value) > 50:
                butt[id] = name

    json.dump(butt, open(dest,'w+'))
    print('sucessfully processed ' + dest)


def line_to_trip(line):
    l = line.split()
    val = l.pop()
    id = l.pop(0)
    return[ id, ' '.join(l), val]


convert(a)
convert(c)

def key_func(row):
    return int(row.value)

def join():
    fa = "./data/" + a + ".json"
    fc = "./data/" + c + ".json"

    movies = []
    #id, name, value
    print(fa, fc)
    taglist = json.loads(open(fa, 'r').read())

    #id, name, value
    movielist = json.loads(open(fc, 'r').read())


    src = './data/tag-genome/' +  'tag_relevance' + '.dat'

    records = {}

    with open(src, 'r') as f:
        for line in f:
            mov_id, tag_id, rel = line_to_trip(line)
            movie = movielist.get(mov_id)
            tag = taglist.get(tag_id)

            if not movie in records:
                records[movie] = {'tags': []}

            if type(tag) is str:
                records[movie]['tags'].append({
                    'name': tag,
                    'value': float(rel)
                })
    midlist = {v: k for k, v in movielist.items()}
    tidlist = {v: k for k, v in taglist.items()}
    taglist = list(taglist.values())

    edges = {k:[] for k in taglist}

    def process(key, record):
        tags = sorted(record['tags'], key=lambda x: -x['value'])[:10]

        for tag in tags: edges[tag['name']].append(
                re.sub('\(\d*\)', '', key).strip()
        )

        return {
            'date': re.search('\(\d+\)', key)[0],
            'tags': [n['name'] for n in tags]
        }

    processed = {
        re.sub('\(\d*\)', '', key).strip(): process(key, record)
        for key, record in records.items()
        if key
    }

    dest = './data/join.json'

    #IPython.embed()


    def makenode(name, model):
        import random
        r = lambda: random.randint(0,255)
        return {
            'id': midlist[name],
            'size': .3,
            'x': random.uniform(0, 500),
            'y': random.uniform(0, 200),
            'color': ('#%02X%02X%02X' % (r(),r(),r()))
            #'label': 'butt'
        }

    # def makeedge():
    #     return {
    #         'source': 
    #         'target':
    #         'id': 
    #     }
    nodes = [makenode(n,m) for n,m  in records.items() if n]
    sigEdge = []
    pid = [n['id'] for n in nodes]
    for k, movielist in enumerate(nodes):
        import random
        sigEdge.append({
            'source': random.choice(pid),
            'target': random.choice(pid),
            'id': k
        })

    json.dump({
        'tags': taglist,
        'movies': processed,
        'connections': edges
        # 'nodes': nodes,
        # 'edges': sigEdge
    }, open(dest,'w+'))



join()

print('great success')
