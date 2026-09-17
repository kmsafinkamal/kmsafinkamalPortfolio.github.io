import urllib.request
import json
import re
import html
import os
import sys

SCHOLAR_URL = "https://scholar.google.com/citations?user=gpR1AC8AAAAJ&hl=en&pagesize=100"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Sec-Ch-Ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1"
}

def fetch_scholar_html(url=SCHOLAR_URL):
    print(f"Fetching live Google Scholar profile: {url}...")
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            raw_bytes = resp.read()
            html_text = raw_bytes.decode('utf-8', errors='replace')
            print(f"Successfully fetched {len(html_text)} bytes from Google Scholar.")
            return html_text
    except Exception as e:
        print(f"Notice fetching live Scholar page ({e}). Checking local cache...")
        if os.path.exists("scholar_live.html"):
            print("Using cached scholar_live.html...")
            with open("scholar_live.html", "r", encoding="utf-8", errors="replace") as f:
                return f.read()
        raise e

def clean_text(text):
    if not text:
        return ""
    text = html.unescape(text)
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Replace non-breaking spaces and ellipses
    text = text.replace('\xa0', ' ').replace('\u2026', '...').replace('\ufffd', '...')
    # Normalize multiple whitespace
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_citation_timeline(raw_html):
    """
    Extracts the per-year citation progression directly from the Google Scholar profile graph.
    Matches strictly the bars rendered on the live Google Scholar profile.
    """
    years_matches = re.findall(r'<span class="gsc_g_t"[^>]*style="right:([0-9]+)px"[^>]*>([0-9]{4})</span>', raw_html)
    citations_matches = re.findall(r'<a[^>]*class="gsc_g_a"[^>]*style="right:([0-9]+)px[^"]*"[^>]*><span class="gsc_g_al">([0-9]+)</span></a>', raw_html)

    timeline = []
    if years_matches and citations_matches:
        for y_pos_str, year_str in years_matches:
            y_pos = int(y_pos_str)
            year = int(year_str)
            best_cit = 0
            min_diff = 999
            for c_pos_str, cit_str in citations_matches:
                c_pos = int(c_pos_str)
                diff = abs(y_pos - c_pos)
                if diff < min_diff:
                    min_diff = diff
                    best_cit = int(cit_str)
            timeline.append({"year": year, "citations": best_cit})
        timeline.sort(key=lambda x: x["year"])

    # Fallback pattern: sequential order
    if not timeline:
        alt_years = [int(y) for y in re.findall(r'<span class="gsc_g_t"[^>]*>([0-9]{4})</span>', raw_html)]
        alt_cits = [int(c) for c in re.findall(r'<span class="gsc_g_al">([0-9]+)</span>', raw_html)]
        if len(alt_years) == len(alt_cits) and alt_years:
            for y, c in zip(alt_years, alt_cits):
                timeline.append({"year": y, "citations": c})
            timeline.sort(key=lambda x: x["year"])

    # Calculate relative percentage for visual spark-bars based on highest year
    if timeline:
        max_c = max(t["citations"] for t in timeline) or 1
        for item in timeline:
            item["percentage"] = round((item["citations"] / max_c) * 100)

    return timeline

def extract_papers_timeline(publications):
    """
    Computes the number of papers published per year from the extracted publications.
    """
    counts_by_year = {}
    for p in publications:
        yr = p.get("year")
        if yr:
            counts_by_year[yr] = counts_by_year.get(yr, 0) + 1

    if not counts_by_year:
        return []

    years = sorted(counts_by_year.keys())
    max_p = max(counts_by_year.values()) or 1

    timeline = []
    for yr in years:
        cnt = counts_by_year[yr]
        timeline.append({
            "year": yr,
            "count": cnt,
            "percentage": round((cnt / max_p) * 100)
        })
    return timeline

def sync():
    raw_html = fetch_scholar_html()

    # Cache fresh HTML locally
    with open("scholar_live.html", "w", encoding="utf-8") as f:
        f.write(raw_html)

    # 1. Author Name
    name_match = re.search(r'<div id="gsc_prf_in">([^<]+)</div>', raw_html)
    author_name = clean_text(name_match.group(1)) if name_match else "K. M. Safin Kamal"

    # 2. Affiliation
    full_aff_match = re.search(r'<div class="gsc_prf_il">([^<]*(?:<a[^>]*>[^<]+</a>)?[^<]*)</div>', raw_html)
    if full_aff_match:
        aff_text = clean_text(full_aff_match.group(1))
    else:
        aff_text = "Lecturer in CSE dept of East West University"

    # 3. Verified email
    email_match = re.search(r'id="gsc_prf_ivh">([^<]+)</div>', raw_html)
    email_info = clean_text(email_match.group(1)) if email_match else "Verified email at ewubd.edu"

    # 4. Research Interests
    interests = [clean_text(i) for i in re.findall(r'class="gsc_prf_inta[^"]*"[^>]*>([^<]+)</a>', raw_html)]
    if not interests:
        interests = ["Machine Learning (ML)", "Deep Learning (DL)", "Computer Vision", "LSTM"]

    # 5. Metrics Table
    metrics_dict = {"citations": 41, "hIndex": 4, "i10Index": 0}
    table_match = re.search(r'<table id="gsc_rsb_st".*?>(.*?)</table>', raw_html, re.DOTALL)
    if table_match:
        t_content = table_match.group(1)
        rows = re.findall(r'<tr[^>]*>\s*<td class="gsc_rsb_sc1">.*?>(.*?)</a></td>\s*<td class="gsc_rsb_std">([0-9]+)</td>\s*<td class="gsc_rsb_std">([0-9]+)</td>', t_content)
        for m_name, m_all, m_recent in rows:
            clean_name = m_name.lower().replace('-', '')
            val = int(m_all)
            if 'citation' in clean_name:
                metrics_dict["citations"] = val
            elif 'hindex' in clean_name:
                metrics_dict["hIndex"] = val
            elif 'i10' in clean_name:
                metrics_dict["i10Index"] = val

    # 6. Extract Citations Histogram per Year directly from Google Scholar Graph
    citation_timeline = extract_citation_timeline(raw_html)
    print(f"Extracted Google Scholar Citation Timeline: {citation_timeline}")

    # 7. Extract All Publication Rows
    paper_rows = re.findall(r'<tr class="gsc_a_tr">(.*?)</tr>', raw_html, re.DOTALL)
    print(f"Found {len(paper_rows)} publication entries on Google Scholar.")

    publications = []
    for idx, row in enumerate(paper_rows):
        # Title
        title_match = re.search(r'<a\s+[^>]*class="gsc_a_at"[^>]*>(.*?)</a>', row, re.DOTALL)
        if not title_match:
            title_match = re.search(r'<a\s+href="([^"]+)"\s+class="gsc_a_at"[^>]*>(.*?)</a>', row, re.DOTALL)
        title = clean_text(title_match.group(1 if len(title_match.groups()) == 1 else 2)) if title_match else f"Research Publication {idx+1}"

        # Scholar Citation Link
        href_match = re.search(r'href="(/citations\?view_op=view_citation[^"]+)"', row)
        if not href_match:
            href_match = re.search(r'<a\s+href="([^"]+)"', row)
        scholar_link = ("https://scholar.google.com" + html.unescape(href_match.group(1))) if href_match else ""

        # Authors & Venue
        gray_divs = re.findall(r'<div class="gs_gray">(.*?)</div>', row, re.DOTALL)
        authors_raw = gray_divs[0] if len(gray_divs) > 0 else ""
        venue_raw = gray_divs[1] if len(gray_divs) > 1 else ""

        authors = clean_text(authors_raw)

        # Remove inner span in venue before cleaning
        venue_clean = clean_text(re.sub(r'<span class="gs_oph">.*?</span>', '', venue_raw))
        venue_clean = re.sub(r'[\s,]+$', '', venue_clean).strip()

        # Citations
        cited_match = re.search(r'<a\s+[^>]*class="gsc_a_ac[^"]*"[^>]*>([0-9]+)</a>', row)
        citations = int(cited_match.group(1)) if cited_match else 0

        # Year
        year_match = re.search(r'<span class="gsc_a_h[^"]*">([0-9]{4})</span>', row)
        year = int(year_match.group(1)) if year_match else None
        if not year and venue_raw:
            y_search = re.search(r'\b(20[12][0-9])\b', venue_raw)
            if y_search:
                year = int(y_search.group(1))
        if not year:
            year = 2024

        # Categorization based on title and venue semantics
        t_lower = title.lower()
        if any(w in t_lower for w in ['blood', 'anemia', 'pneumonia', 'x-ray', 'leukem', 'cancer', 'tumour', 'tumor', 'mri', 'medical', 'malaria', 'meniscal', 'orthopedic', 'retin', 'cell', 'b-all', 'disease', 'chest', 'brain', 'ultrasound', 'microscopy']):
            category = 'biomedical'
        elif any(w in t_lower for w in ['cloud', 'energy', 'green', 'datacenter', 'data center', 'scheduling', 'resource scheduling', 'cryptocurrency', 'mining', 'blockchain']):
            category = 'green-cloud'
        elif any(w in t_lower for w in ['security', 'spyware', 'privacy', 'federated', 'espionage', 'malware', 'adversarial', 'cyber']):
            category = 'security'
        elif any(w in t_lower for w in ['image', 'plate', 'detection', 'vision', 'classification', 'soil', 'crop', 'agriculture', 'forest', 'face', 'sign', 'yolo', 'cnn', 'lstm']):
            category = 'computer-vision'
        else:
            category = 'biomedical' if 'cell' in t_lower else 'computer-vision'

        # Citation formatting
        first_author_surname = authors.split(',')[0].split()[-1].lower() if authors else "kamal"
        first_author_surname = re.sub(r'[^a-z0-9]', '', first_author_surname) or "kamal"
        citation_key = f"{first_author_surname}{year}p{idx+1}"

        search_query = re.sub(r'[^a-zA-Z0-9+]', '+', title)

        pub_entry = {
            "id": f"p{idx+1}",
            "title": title,
            "category": category,
            "citations": citations,
            "year": year,
            "authors": authors,
            "venue": venue_clean if venue_clean else "Peer-Reviewed Academic Conference / Journal",
            "abstract": f"Academic research contribution by {authors} titled \"{title}\". Published in {venue_clean} ({year}) with {citations} verified Google Scholar citation{'s' if citations != 1 else ''}.",
            "scholarLink": scholar_link,
            "links": {
                "Scholar": scholar_link,
                "DOI": f"https://scholar.google.com/scholar?q={search_query}",
                "Search": f"https://scholar.google.com/scholar?q={search_query}"
            },
            "bibtex": f"""@inproceedings{{{citation_key},
  title = {{{title}}},
  author = {{{authors}}},
  booktitle = {{{venue_clean}}},
  year = {{{year}}},
  citations = {{{citations}}}
}}""",
            "apa": f"{authors} ({year}). {title}. {venue_clean}.",
            "ieee": f'{authors}, "{title}," in {venue_clean}, {year}.'
        }
        publications.append(pub_entry)

    # 8. Compute Papers Published per Year Timeline
    papers_timeline = extract_papers_timeline(publications)
    print(f"Extracted Papers Published Timeline: {papers_timeline}")

    # Write src/data/publications.json
    os.makedirs(r"src/data", exist_ok=True)
    with open(r"src/data/publications.json", "w", encoding="utf-8") as f:
        json.dump(publications, f, indent=2, ensure_ascii=False)

    # Build and write profile.json preserving existing custom edits
    existing_profile = {}
    if os.path.exists(r"src/data/profile.json"):
        try:
            with open(r"src/data/profile.json", "r", encoding="utf-8") as f:
                existing_profile = json.load(f)
        except Exception:
            pass

    bio_text = f"K. M. Safin Kamal is a Lecturer in the Department of Computer Science and Engineering at East West University. His research spans Machine Learning, Deep Learning, Medical Computer Vision (oncology, hematology, and radiography diagnostics), and Energy-Aware Distributed Systems. With {len(publications)} scholarly publications and {metrics_dict['citations']} verified citations, his work advances automated healthcare intelligence and sustainable cloud computing."

    profile_data = {
        "name": existing_profile.get("name", author_name),
        "title": existing_profile.get("title", "Lecturer, Department of Computer Science & Engineering"),
        "institution": existing_profile.get("institution", "East West University"),
        "department": existing_profile.get("department", "Department of Computer Science & Engineering (CSE)"),
        "affiliations": existing_profile.get("affiliations", [
            "Lecturer, Department of Computer Science & Engineering, East West University",
            "Lead Researcher, Biomedical AI & Medical Computer Vision",
            "Researcher, Distributed Computing & Green Cloud Systems"
        ]),
        "emailVerified": email_info,
        "email": existing_profile.get("email", "safin.kamal@ewubd.edu"),
        "location": existing_profile.get("location", "Dhaka, Bangladesh"),
        "verified": True,
        "interests": interests if interests else existing_profile.get("interests", []),
        "metrics": {
            "citations": metrics_dict["citations"],
            "hIndex": metrics_dict["hIndex"],
            "i10Index": metrics_dict["i10Index"],
            "publicationsCount": len(publications)
        },
        "citationTimeline": citation_timeline if citation_timeline else existing_profile.get("citationTimeline", [
            { "year": 2024, "citations": 3, "percentage": 17 },
            { "year": 2025, "citations": 18, "percentage": 100 },
            { "year": 2026, "citations": 17, "percentage": 94 }
        ]),
        "papersTimeline": papers_timeline,
        "bio": existing_profile.get("bio", bio_text),
        "researchPillars": existing_profile.get("researchPillars", [
            {
                "id": "biomedical",
                "title": "Biomedical AI & Oncology",
                "description": "High-accuracy multi-class hematology classification (anemia, leukemia), MRI scan tumor detection, and explainable AI (Grad-CAM) for pneumonia in chest radiographs.",
                "icon": "biotech",
                "stats": f"{len([p for p in publications if p['category'] == 'biomedical'])} Publications",
                "highlight": "Microscopy & radiology computer vision"
            },
            {
                "id": "computer-vision",
                "title": "Edge Computer Vision & Remote Sensing",
                "description": "Automated digital license plate recognition, soil classification for smart agriculture, forest cover type voting classifiers, and multi-scale CNN transfer learning.",
                "icon": "visibility",
                "stats": f"{len([p for p in publications if p['category'] == 'computer-vision'])} Publications",
                "highlight": "Real-time edge neural inference"
            },
            {
                "id": "green-cloud",
                "title": "Green Cloud & Distributed Computing",
                "description": "Greedy algorithmic task scheduling, renewable energy load balancing, and carbon emission minimization for blockchain mining and modern datacenters.",
                "icon": "cloud",
                "stats": f"{len([p for p in publications if p['category'] == 'green-cloud'])} Publications",
                "highlight": "Energy efficiency optimization"
            },
            {
                "id": "security",
                "title": "Privacy, Federated AI & Security",
                "description": "Privacy-preserving federated ensemble learning for decentralized healthcare models, defensive spyware analysis, and secure multi-agent systems.",
                "icon": "security",
                "stats": f"{len([p for p in publications if p['category'] == 'security'])} Publications",
                "highlight": "Federated privacy architectures"
            }
        ]),
        "timeline": existing_profile.get("timeline", [
            {
                "year": "Current",
                "role": "Lecturer",
                "institution": "Department of Computer Science & Engineering, East West University",
                "description": "Teaching undergraduate computer science and machine learning courses while leading research in medical imaging and energy-efficient systems."
            },
            {
                "year": "2023 - 2024",
                "role": "Graduate & Faculty Researcher",
                "institution": "East West University / International Collaborations",
                "description": "Authored and co-authored extensive publications across IEEE, Elsevier, and Springer indexed conferences and journals."
            },
            {
                "year": "2019 - 2023",
                "role": "B.Sc. in Computer Science and Engineering",
                "institution": "East West University",
                "description": "Graduated with outstanding academic distinction; actively published multiple peer-reviewed research papers in international venues."
            }
        ]),
        "skills": existing_profile.get("skills", [
            {"category": "AI / ML Core", "items": ["Deep Learning", "Convolutional Neural Networks (CNN)", "LSTM & Recurrent Nets", "Transfer Learning", "Explainable AI (Grad-CAM)", "Federated Learning"]},
            {"category": "Libraries & Frameworks", "items": ["PyTorch", "TensorFlow", "Keras", "Scikit-Learn", "OpenCV", "NumPy / Pandas"]},
            {"category": "Distributed Systems", "items": ["Green Cloud Computing", "Datacenter Scheduling", "Heuristic Optimization", "Docker", "Linux"]},
            {"category": "Languages & Academic Tools", "items": ["Python", "C/C++", "JavaScript", "MATLAB", "LaTeX", "Git"]}
        ]),
        "socialLinks": existing_profile.get("socialLinks", [
            {"label": "Google Scholar", "url": "https://scholar.google.com/citations?user=gpR1AC8AAAAJ&hl=en", "icon": "school"},
            {"label": "East West University Profile", "url": "https://www.ewubd.edu", "icon": "apartment"},
            {"label": "ResearchGate", "url": "https://www.researchgate.net", "icon": "science"},
            {"label": "GitHub", "url": "https://github.com", "icon": "code"},
            {"label": "LinkedIn", "url": "https://www.linkedin.com", "icon": "person"}
        ]),
        "photoUrl": existing_profile.get("photoUrl", ""),
        "projects": existing_profile.get("projects", []),
        "teaching": existing_profile.get("teaching", []),
        "mentorship": existing_profile.get("mentorship", []),
        "news": existing_profile.get("news", []),
        "services": existing_profile.get("services", []),
        "honors": existing_profile.get("honors", []),
        "officeRoom": existing_profile.get("officeRoom", "Room CSE-512"),
        "teachingInfo": existing_profile.get("teachingInfo", {})
    }

    # Auto-update verified citations milestone in news
    updated_news = list(existing_profile.get("news", []))
    milestone_title = f"Google Scholar Citations milestone: {metrics_dict['citations']}+ verified citations across {len(publications)} peer-reviewed articles"
    milestone_found = False
    for n in updated_news:
        if "google scholar citation" in n.get("title", "").lower() or n.get("badge") == "Milestone":
            n["title"] = milestone_title
            milestone_found = True
            break
    if not milestone_found and len(publications) > 0:
        updated_news.insert(0, {
            "date": "Live Synced",
            "title": milestone_title,
            "venue": "Google Scholar Verified Index",
            "type": "milestone",
            "badge": "Milestone"
        })
    profile_data["news"] = updated_news

    with open(r"src/data/profile.json", "w", encoding="utf-8") as f:
        json.dump(profile_data, f, indent=2, ensure_ascii=False)

    # Sync directly to SQLite database if it exists
    db_path = os.path.join("server", "portfolio.db")
    if os.path.exists(db_path):
        try:
            import sqlite3
            conn = sqlite3.connect(db_path)
            cur = conn.cursor()
            cur.execute("SELECT data FROM profile WHERE id = 1")
            row = cur.fetchone()
            if row:
                current_db_profile = json.loads(row[0])
                if current_db_profile.get("photoUrl") and not profile_data.get("photoUrl"):
                    profile_data["photoUrl"] = current_db_profile["photoUrl"]
                for k in ["projects", "teaching", "mentorship", "news", "services", "honors", "officeRoom", "teachingInfo"]:
                    if not profile_data.get(k) and current_db_profile.get(k):
                        profile_data[k] = current_db_profile[k]
                cur.execute("UPDATE profile SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1", (json.dumps(profile_data, ensure_ascii=False),))
            
            cur.execute("DELETE FROM publications")
            for p in publications:
                cur.execute("""INSERT INTO publications 
                    (id, title, category, citations, year, authors, venue, abstract, scholar_link, links, bibtex, apa, ieee)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (p["id"], p["title"], p["category"], p["citations"], p["year"], p["authors"], p["venue"],
                     p["abstract"], p["scholarLink"], json.dumps(p.get("links", {})), p["bibtex"], p["apa"], p["ieee"]))
            conn.commit()
            conn.close()
            print("Successfully synchronized with SQLite server/portfolio.db!")
        except Exception as dbe:
            print(f"Notice updating SQLite db: {dbe}")

    print("\n--- Google Scholar Sync Complete ---")
    print(f"Researcher: {author_name}")
    print(f"Affiliation: {aff_text}")
    print(f"Total Publications: {len(publications)}")
    print(f"Total Citations: {metrics_dict['citations']}")
    print(f"h-index: {metrics_dict['hIndex']}")
    print(f"i10-index: {metrics_dict['i10Index']}")
    print(f"Citations Timeline (Google Scholar synced): {citation_timeline}")
    print(f"Papers Timeline (Google Scholar synced): {papers_timeline}")
    print("Updated src/data/publications.json, src/data/profile.json, and SQLite database!")

if __name__ == "__main__":
    sync()
