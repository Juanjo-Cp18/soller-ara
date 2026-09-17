import importlib.util
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("update_sources", ROOT / "scripts/update_sources.py")
collector = importlib.util.module_from_spec(spec)
spec.loader.exec_module(collector)


class SourceCollectionTests(unittest.TestCase):
    def test_youtube_local_filter_does_not_match_author_or_generated_summary(self):
        source = {"type": "youtube_channel", "include_keywords": ["Sóller", "Fornalutx"]}
        posts = [
            {"title": "Ballada a Palma", "summary": "Vídeo publicat per una entitat de Sóller.",
             "url": "https://www.youtube.com/watch?v=Soller"},
            {"title": "Ballada a Fornalutx", "summary": "", "url": "https://www.youtube.com/watch?v=local"},
            {"title": "Concert a So\u0301ller", "summary": "", "url": "https://www.youtube.com/watch?v=local2"},
        ]
        self.assertEqual(collector.filter_by_keywords(source, posts), posts[1:])

    def test_rss_local_filter_still_accepts_original_url(self):
        post = {"title": "Millores al municipi", "summary": "", "url": "https://example.test/noticies/soller"}
        self.assertEqual(collector.filter_by_keywords(
            {"type": "rss", "include_keywords": ["Soller"]}, [post]), [post])

    def test_video_dates_exclude_old_future_and_undated_posts(self):
        now = datetime.now(timezone.utc)
        posts = [
            {"id": "recent", "published_at": (now - timedelta(days=1)).isoformat()},
            {"id": "archive", "published_at": (now - timedelta(days=61)).isoformat()},
            {"id": "future", "published_at": (now + timedelta(days=1)).isoformat()},
            {"id": "undated", "published_at": None},
        ]
        self.assertEqual(collector.filter_by_max_age({"max_age_days": 60}, posts), posts[:1])

    def test_cultural_titles_do_not_create_municipal_claims(self):
        source = {"id": "youtube-cultural", "name": "Entitat cultural"}
        for title in ["Concert complet", "Sessió de música", "Joan Miquel Oliver"]:
            summary = collector.social_summary_from_title(source, title)
            self.assertNotIn("municipal", summary)
            self.assertNotIn("Retransmissió", summary)
        municipal = {"id": "youtube-ajuntament-soller", "name": "Ajuntament de Sóller"}
        self.assertIn("sessió plenària", collector.social_summary_from_title(municipal, "Ple ordinari"))

    def test_youtube_retains_original_metadata_without_copying_description_or_image(self):
        source = {"id": "youtube-cultural", "name": "Entitat cultural", "url": "https://www.youtube.com/feeds/videos.xml",
                  "type": "youtube_channel", "source_type": "social", "platform": "YouTube",
                  "account": "@cultural", "image_policy": "embed_only", "content_policy": "generated_social_summary"}
        feed = b'''<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
          <entry><title>Concert complet a Soller</title><published>2026-09-16T18:00:00Z</published>
          <link rel="alternate" href="https://www.youtube.com/watch?v=abcdefghijk"/>
          <media:group><media:description>Text original llarg que no s'ha de copiar.</media:description>
          <media:thumbnail url="https://example.test/protected.jpg"/></media:group></entry></feed>'''
        with patch.object(collector, "fetch_bytes", return_value=(feed, "utf-8")):
            post = collector.fetch_youtube_channel(source)[0]
        self.assertEqual(post["url"], "https://www.youtube.com/watch?v=abcdefghijk")
        self.assertEqual(post["published_at"], "2026-09-16T18:00:00+00:00")
        self.assertEqual(post["account"], "@cultural")
        self.assertEqual(post["media_type"], "video")
        self.assertFalse(post["image_allowed"])
        self.assertNotIn("Text original", post["summary"])
        self.assertNotIn("media_url", post)


if __name__ == "__main__":
    unittest.main()
