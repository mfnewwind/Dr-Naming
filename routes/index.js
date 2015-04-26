var express = require('express');
var router = express.Router();
var passport = require('passport');

// トップ
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render('user', {});
  } else {
    res.render('login', {});
  }
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
router.get('/introduction', function(req, res){
  res.render('introduction', {});
});

// リポジトリ選択
router.get('/select_repo', function(req, res){
  res.render('select_repo', {});
});

// リポジトリ一覧
router.get('/repo/:user', function(req, res){
  res.render('user', {});
});

// プロジェクトページ (変数, 関数, クラス一覧, コードビュー)
router.get('/repo/:user/:repo', function(req, res){
  res.render('repo_variables', {});
});
// 変数一覧
router.get('/repo/:user/:repo/variables', function(req, res){
  res.render('repo_variables', {});
});
// 関数一覧
router.get('/repo/:user/:repo/functions', function(req, res){
  res.render('repo_functions', {});
});
// クラス一覧
router.get('/repo/:user/:repo/classes', function(req, res){
  res.render('repo_classes', {});
});
//コードレビュー
router.get('/repo/:user/:repo/codeview', function(req, res){
  res.render('document_codeview', {});
});


// コードレビューページ(確認用)　TODO:おかしかったら書き直して。
router.get('/document_codeview', function(req, res){
  res.render('document_codeview', {});
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

module.exports = router;
