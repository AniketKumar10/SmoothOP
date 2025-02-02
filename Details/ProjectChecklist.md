# Project Checklist

## Phase 1: Planning & Design
- [x] Finalize project features and scope
- [x] Design user experience (UI/UX)
- [x] Create wireframes/mockups for the browser extension and backend system
- [x] Plan the database structure for job link storage and user management

## Phase 2: Core Feature Development
- [x] Build the core functionality: auto-fill job application forms
- [x] Implement file upload system (resume, transcript)
- [x] Implement job link tracking
- [x] Integrate with 1–2 job platforms (e.g., LinkedIn, Indeed)
- [x] Initial testing of core features

## Phase 3: AI Features Development
- [x] Implement AI-driven features like job description analysis
- [x] Develop job application answer suggestions based on user background using AI
- [x] Integrate pre-trained models for resume and cover letter optimization (if applicable)

## Phase 4: Global Job Recommendations System (Post-Launch)
- [ ] Build the job recommendations system to suggest job openings to global users based on stored links and posting dates

## Phase 5: Testing & Deployment
- [x] Perform QA testing for Chrome support and core features
- [x] Optimize the extension for speed and usability
- [ ] Deploy the extension on the Chrome Web Store
- [ ] Gather user feedback from beta testing to refine the final product

## Additional Tasks
- [x] Resolve region and phone type selection updates
- [x] Implement Docker and Kubernetes for backend services (basic setup done)
- [x] Set up CI/CD pipeline with GitHub Actions (initial version complete)
- [x] Implement monitoring and logging with Prometheus and Grafana (in progress)

## Notes
- [x] Consider adding support for other browsers post-launch
- [x] Plan for regular updates and maintenance
- [x] Gather user feedback continuously to improve the product

## Changes & Issues to Resolve

### Changes
- [x] Region value updated from "Mumbai" to "Maharashtra"
- [x] Phone device type changed from "Mobile" to "Cell Phone"
- [x] `userProfile` object updated with correct properties
- [x] Dropdown handling improved for Workday
- [x] Added specific selectors for Workday fields

### Future Issues to Resolve
- [ ] Country code selection for Workday still not functioning as expected
  - Needs a refined approach to handle multi-step selection
- [ ] Verify successful selection of the dropdown option before moving on
- [ ] Full automated testing across major job portals (Indeed, LinkedIn, Workday)  
- [ ] Full integration of AI-based job application analysis (final polishing)
- [ ] Final deployment steps for Chrome Web Store release