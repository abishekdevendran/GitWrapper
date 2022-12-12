// Middleware to check if the user is authenticated with GitHub

import { Request, Response, NextFunction } from 'express';
import { Octokit } from '@octokit/core';
import { createOAuthUserAuth } from '@octokit/auth-oauth-user';