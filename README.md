# TV Show DOM Project

A starting point for CYF's TV show DOM project

## Github Instructions:
- Fork this repo
- Create a branch called `for-review`, push it into your github and create PR into `upstream/main`
- For each level you will be branching out from the `for-review`
- For `Level 100`: 
    -- Branch out from `for-review` into `feature/level-100`
    -- Use vscode to edit your local copy of the project
    -- Once `Level 100` is done and you are happy with the result, checkout into `for-review` and do 
    ```shell
        git merge feature/level-100 --squash
    ```
    -- Push `for-review` into your github
- Repeat above step for the next level.

## Task Instructions:
- Start with [Level 100](https://syllabus.codeyourfuture.io/js-core-3/tv-show-dom-project/level-100)
- Right click on index.html and open with live server
- Confirm in the browser that you can see the red text: "Got 73 episode(s)"
- Edit index.html to include your name and github username in the page title instead of (My Name (My GitHub username))
- Configure your site for automatic deployment to Netlify [Instructions here](https://syllabus.codeyourfuture.io/guides/deployment-netlify/)
- Ensure the netlify site name is exactly USERNAME-tv.netlify.app where USERNAME is YOUR github username.
- Visit your deployed site
- Set your new repo's website link on github to be your netlify URL, under `About` section in the right hand side on your github TV repo.
