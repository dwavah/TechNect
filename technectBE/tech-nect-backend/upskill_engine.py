# upskill_engine.py
import sys
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def recommend_upskills(student_skills, job_skills_list):
    all_skills = job_skills_list + [student_skills]
    vectorizer = TfidfVectorizer().fit_transform(all_skills)
    vectors = vectorizer.toarray()
    
    student_vec = vectors[-1]
    job_vecs = vectors[:-1]
    
    similarities = cosine_similarity([student_vec], job_vecs)[0]

    # Flatten job skill text and pick most similar sets
    suggestions = set()
    for i, sim in enumerate(similarities):
        if sim < 1.0:  # exclude perfect match
            for skill in job_skills_list[i].split(","):
                skill = skill.strip()
                if skill.lower() not in student_skills.lower():
                    suggestions.add(skill)

    print(json.dumps(list(suggestions[:10])))  # Return top 10 suggestions

if __name__ == "__main__":
    input_json = json.loads(sys.argv[1])
    student_skills = input_json["student_skills"]
    job_skills_list = input_json["job_skills_list"]
    recommend_upskills(student_skills, job_skills_list)
