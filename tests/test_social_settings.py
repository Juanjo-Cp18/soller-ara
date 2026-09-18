import importlib.util
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("manage_social_settings", ROOT / "scripts/manage_social_settings.py")
settings = importlib.util.module_from_spec(spec)
spec.loader.exec_module(settings)


class SocialSettingsTests(unittest.TestCase):
    def setUp(self):
        self.config = {
            "version": 4,
            "enabled": True,
            "platforms": {"facebook": True, "instagram": True},
            "sources": {"source-a": {"facebook": True, "instagram": False}},
        }
        self.sources = {"sources": [{"id": "source-a"}, {"id": "source-b"}]}

    def test_pause_and_source_selection_preserve_other_settings(self):
        result = settings.apply_change(self.config, self.sources, {
            "base_version": 4,
            "enabled": False,
            "sources": {
                "source-a": {"facebook": False, "instagram": False},
                "source-b": {"facebook": True, "instagram": True},
            },
        })
        self.assertFalse(result["enabled"])
        self.assertEqual(result["version"], 5)
        self.assertEqual(result["platforms"], self.config["platforms"])
        self.assertEqual(result["sources"]["source-b"], {"facebook": True, "instagram": True})
        self.assertTrue(self.config["enabled"])

    def test_stale_version_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "configuración ha cambiado"):
            settings.apply_change(self.config, self.sources, {"base_version": 3, "enabled": False})

    def test_unknown_source_or_incomplete_rule_is_rejected(self):
        invalid = [
            {"base_version": 4, "sources": {"unknown": {"facebook": True, "instagram": True}}},
            {"base_version": 4, "sources": {"source-a": {"facebook": True}}},
        ]
        for change in invalid:
            with self.subTest(change=change), self.assertRaisesRegex(ValueError, "selección"):
                settings.apply_change(self.config, self.sources, change)

    def test_identical_change_does_not_increase_version(self):
        result = settings.apply_change(self.config, self.sources, {
            "base_version": 4,
            "enabled": True,
            "sources": {"source-a": {"facebook": True, "instagram": False}},
        })
        self.assertEqual(result, self.config)


if __name__ == "__main__":
    unittest.main()
