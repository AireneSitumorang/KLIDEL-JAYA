import zipfile
import json
import os
import sys

def main():
    src_figcraft = 'klinik-gabe-medica.figcraft'
    dst_figcraft = 'klinik-maristella.figcraft'

    if not os.path.exists(src_figcraft):
        print(f"Error: {src_figcraft} not found")
        sys.exit(1)

    with zipfile.ZipFile(src_figcraft, 'r') as zin:
        doc = json.loads(zin.read('document.json').decode('utf-8'))
        
        # Update Document metadata
        doc['name'] = 'Klinik Maristella - Master Mockup & UI Design System'
        
        nodes = doc.get('nodes', {})
        for nid, node in nodes.items():
            # Update names
            if 'name' in node and isinstance(node['name'], str):
                node['name'] = node['name'].replace('Gabe Medica', 'Klinik Maristella')
            
            # Update text content
            if 'text' in node and isinstance(node['text'], str):
                node['text'] = node['text'].replace('Gabe Medica', 'Klinik Maristella')
                node['text'] = node['text'].replace('GM-', 'KM-')
            
            # If page node
            if node.get('type') == 'page':
                node['name'] = 'Klinik Maristella'

        # Write out to new zip file
        with zipfile.ZipFile(dst_figcraft, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                if item.filename == 'document.json':
                    zout.writestr('document.json', json.dumps(doc, indent=2).encode('utf-8'))
                else:
                    zout.writestr(item.filename, zin.read(item.filename))

    print(f"Successfully generated {dst_figcraft} with updated Klinik Maristella layers!")

if __name__ == '__main__':
    main()
