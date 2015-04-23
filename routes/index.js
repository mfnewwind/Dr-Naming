var express = require('express');
var router = express.Router();
var passport = require('passport');

// トップ
router.get('/', function(req, res, next) {
  res.render('index', {});
});

// ログインページ
router.get('/login', function(req, res){
  res.render('login', {});
});

// ログアウト　リダイレクトのみ
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// 紹介ページ
router.get('/about', function(req, res){
  res.render('about', {});
});

// リポジトリ選択
router.get('/select', function(req, res){
  res.render('select', {});
});

// リポジトリ一覧
router.get('/:user', function(req, res){
  res.render('user', {});
});

// プロジェクトページ (変数, 関数, クラス一覧, コードビュー)
router.get('/:user/:repo', function(req, res){
  res.render('repo', {});
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

module.exports = router;
