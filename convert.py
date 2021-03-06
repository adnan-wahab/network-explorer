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
                records[movie]['id'] = mov_id
                records[movie]['tags'].append({
                    'name': tag,
                    'value': float(rel)
                })

    taglist = list(taglist.values())
    edges = {k:[] for k in taglist}

    def process(key, record):
        tags = sorted(record['tags'], key=lambda x: -x['value'])[:10]

        for tag in tags: edges[tag['name']].append(
                re.sub('\(\d*\)', '', key).strip()
        )

        return {
            'date': re.search('\(\d+\)', key)[0],
            'edges': tags,
            'tags': [n['name'] for n in tags]
            #'edgeWeights': [n['values'] for n in tags]
        }

    processed = {
        re.sub('\(\d*\)', '', key).strip(): process(key, record)
        for key, record in records.items()
        if key
    }

    dest = './data/join.json'

    #IPython.embed()

    json.dump({
        'tags': taglist,
        'movies': processed,
        'connections': edges
        # 'nodes': nodes,
        # 'edges': sigEdge
    }, open(dest,'w+'))



join()

print('great success')
