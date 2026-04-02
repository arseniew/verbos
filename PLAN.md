Architectural Blueprint and Implementation Strategy for a Gamified Spanish Verb Learning Web Application
The development of an effective educational application for language acquisition requires a synthesis of robust software engineering, cognitive science, and rigorous linguistic data modeling. The objective is to architect a gamified, web-based Spanish verb learning application structured around a four-screen flow. To ensure maximum efficacy, the system must integrate a granular spaced repetition algorithm that tracks individual combinations of verbs, pronouns, and tenses. Furthermore, the architecture must rely on a dynamic, artificial intelligence-driven pipeline to generate context-rich practice sentences, eliminating the constraints of static databases. The following report provides an exhaustive analysis of the requirements, linguistic models, algorithmic strategies, technology stack selections, and a phased development plan.
Requirements Analysis and Strategic Clarifications
Before establishing the technical architecture, a rigorous analysis of the project specifications reveals several areas requiring analytical clarification. Identifying these edge cases early in the design phase ensures that the resulting application remains scalable, maintainable, and pedagogically sound. The following analysis outlines the core questions derived from the initial specifications and provides the definitive architectural recommendations that will guide the implementation.
The first point of clarification pertains to the interplay between the "Stress-Free Mode" and the spaced repetition tracking system. The specification mandates an option to disable the strike mechanic entirely. The analytical question is whether enabling this mode should also suspend the algorithmic tracking of user proficiency. Suspending tracking would undermine the application's core educational value. Therefore, the recommendation is that "Stress-Free Mode" strictly disables the failure condition (the Game Over trigger) and hides the strike counter on the user interface, but the application must continue to silently log the user's correct and incorrect attempts. This ensures that the algorithm continues to promote failed words and fade successful ones, regardless of the gamification settings.
The second area requiring clarification involves the specific behavior of the "Hint" mechanic. The specification dictates that the hint button should reveal the next missing letter, preserving correct characters and removing incorrect trailing characters. The question arises regarding how a hint interaction affects the user's spaced repetition score. If a user relies on a hint, the cognitive retrieval process has been assisted, meaning the memory is not fully stable. The recommendation is to programmatically categorize any answer submitted after utilizing a hint as a "Hard" or "Failed" recall event within the tracking algorithm. The user is allowed to proceed and maintain their gamified streak, but the specific verb-tense-person combination will be promoted for earlier review in subsequent sessions.
The third clarification addresses the persistence of the "last five created sessions." Storing full datasets for past sessions in local storage could lead to rapid quota exhaustion if the application generates hundreds of sentences per session. The recommended solution is to store only the configuration parameters (selected tenses, persons, strike counts, and auxiliary options) as serialized JavaScript Object Notation (JSON) strings. When a user selects a previous session from the Start Screen, the application will instantly rebuild the session queue by passing these parameters back into the spaced repetition querying engine.
Finally, the specification requests a design that is "simple but readable" while accommodating complex linguistic inputs like Spanish accent characters. The recommendation is to adopt a minimalist, high-contrast user interface framework, utilizing a utility-first cascading style sheet (CSS) architecture. The virtual keyboard for accent characters will be implemented as a highly contextual, absolute-positioned component that only intercepts the document object model (DOM) when the primary input field is focused, ensuring it does not clutter the visual space during reading or menu navigation.
Linguistic Data Modeling and Spanish Verb Morphology
To engineer a system capable of accurately testing Spanish verb conjugations, the underlying data structure and artificial intelligence prompts must natively accommodate the immense morphological complexity of the Spanish language. Spanish verbs exhibit intricate patterns, regularities, and orthographic exceptions that must be mapped mathematically within the application.1
Standard Conjugation Paradigms
The Spanish language categorizes verbs into three primary conjugations based on their infinitive suffixes. The application's data schema must initially support these foundational models before expanding into edge cases. The first conjugation consists of verbs ending in -ar, represented by the model verb amar.1 The second conjugation comprises verbs ending in -er, utilizing the model verb temer.1 The third conjugation encompasses verbs ending in -ir, modeled by partir.1 For each of these paradigms, the application must be capable of generating and validating forms across a multitude of tenses, encompassing the Indicative mood (Present, Preterite, Imperfect, Future, Conditional), the Subjunctive mood, and the Imperative mood.1
Morphological Irregularities and Orthographic Shifts
Beyond standard regular verbs, the system's validation logic must account for various categories of irregularities. The application must treat these not as anomalies, but as structured categories within the database.
Stem-changing verbs represent a significant portion of the Spanish lexicon. These verbs undergo predictable vowel shifts in the root during conjugation in specific tenses, primarily the present indicative and subjunctive. The system must track three primary vowel shifts: o mutating to ue (as seen in dormir becoming duermo), e mutating to ie (as in pensar becoming pienso), and e mutating to i (as in pedir becoming pido).2 The spaced repetition algorithm must treat the conjugated forms of these verbs as distinct cognitive entities from their infinitives, as users frequently fail to apply the stem change correctly.
Orthographic variations present another programmatic challenge. These are verbs that are morphologically regular but require spelling changes to maintain phonetic consistency across different conjugations. The application's data models must accommodate verbs ending in -cer or -cir, where the consonant 'c' changes to 'z' or 'zc' depending on the succeeding vowel.1 Similarly, verbs ending in -ger or -gir require a shift from 'g' to 'j' before 'a' or 'o'.1 A notable graphic-articulatory irregularity occurs in verbs like leer, creer, and proveer, where an unaccented 'i' located between two vowels transitions into a 'y' (resulting in forms like leyó instead of the phonetically incorrect leió).1
The application must also natively support highly irregular verbs that defy standard classification. Core lexicon components such as ser, estar, ir, tener, and hacer exhibit unique paradigms across multiple tenses.1 Because these verbs are foundational to daily communication, the application's configuration screen should offer an option to prioritize the integration of these specific irregulars into early learning sessions.
Morphological Category
Characteristics
Primary Examples
Algorithmic Tracking Priority
Regular Paradigms
Adhere strictly to -ar, -er, -ir suffix replacement rules.
amar, temer, partir
Baseline priority.
Stem-Changing
Predictable root vowel shifts (o>ue, e>ie, e>i) under stress.
dormir, pensar, pedir
Elevated priority for specific persons (e.g., yo, tú).
Orthographic Shifts
Spelling modifications to preserve phonetics (e.g., c>zc, i>y).
conducir, leer, escoger
Elevated priority in Subjunctive and Preterite tenses.
Highly Irregular
Idiosyncratic conjugations across multiple tenses.
ser, ir, hacer, tener
Maximum priority due to high frequency of usage.

Regional Variations and Pronoun Selection
The system must address regional dialectal variations, particularly concerning the second-person pronouns. In Peninsular Spanish, vosotros is the standard pronoun for informal plural address.1 Conversely, in Latin American dialects, the Canary Islands, and parts of Andalusia, vosotros is entirely obsolete, replaced by ustedes for both formal and informal plural contexts.1 Consequently, verbal forms for the second-person plural coincide exactly with those of the third-person plural in these regions.1
The application's configuration settings must allow users to toggle their regional focus. If a user selects a Latin American configuration, the application will completely suppress the generation of vosotros sentences and consolidate the tracking metrics for ustedes and ellos/ellas into a shared paradigm. Furthermore, the architecture must be extensible to support voseo rioplatense (the use of vos instead of tú), allowing for the validation of specific accented forms such as amás or tenés.1
Cognitive Science and the Spaced Repetition Algorithm
To fulfill the requirement of promoting words the user fails and fading words answered correctly, the application requires a sophisticated cognitive tracking engine. Traditional language learning applications have historically relied on the SuperMemo-2 (SM-2) algorithm.3 While effective, SM-2 utilizes rigid multiplier factors that fail to adapt accurately to long-term user behavior.
The architectural recommendation is the implementation of the Free Spaced Repetition Scheduler (FSRS), an advanced algorithm backed by empirical academic research that significantly outperforms legacy models.4 FSRS is predicated on the Difficulty, Stability, and Retrievability (DSR) model.4
The DSR Mathematical Model
To effectively manage the scheduling of thousands of verb combinations, the application will assign a DSR profile to every unique item. Difficulty represents the inherent cognitive complexity of the specific verb conjugation. Stability quantifies the storage strength of the memory in the human brain; a higher stability metric dictates that the memory will decay at a substantially slower rate.5 Retrievability denotes the probability that the user will successfully recall the conjugation at any given moment; as time progresses without review, retrievability approaches zero.5
When the user focuses on the Learning Screen, the application assesses their input. The validation logic compares the user's submitted string against the target verb. Upon validation, the system generates a discrete score. In the FSRS paradigm, user interactions are typically graded on a scale: 1 (Again/Fail), 2 (Hard), 3 (Good), and 4 (Easy).8 If the user inputs the exact verb without assistance, the system logs a "Good" score. If the user utilizes the "Hint" button to reveal letters, the system interprets this as cognitive friction and logs an "Again" or "Hard" score.10
These scores are fed into the FSRS mathematical functions. For a correct answer, the stability metric is amplified. The algorithm calculates the next optimal review interval—often pushing it days, weeks, or months into the future, thereby "fading" the consistently answered words from the active queue.11 Conversely, if the user triggers a strike by inputting an incorrect conjugation, the algorithm slashes the stability metric and increases the difficulty metric. The subsequent review interval is aggressively compressed, "promoting" the failed combination to appear in the very next learning session.13
Granular Compound Key Tracking
A critical architectural mandate is that the application must not track verbs globally. Tracking a user's proficiency with the infinitive tener provides no actionable data regarding their ability to conjugate it in the imperfect subjunctive. The application must track the specific verb, person, and tense combinations separately.
The data schema will establish a unique compound string key for every possible iteration. The format will be [Verb_Infinitive]::[Person]. For example, hablar:present:nosotros will maintain a completely isolated DSR profile from hablar:preterite:nosotros.
When the user navigates to the "Create Session" screen and clicks "Start", the application's querying engine iterates over the local storage database. It filters the database for compound keys that match the user's selected tenses and pronouns. It then calculates the current real-time retrievability score for each matching key. Keys whose retrievability has dropped below a specific threshold (e.g., 90% probability of recall) are flagged as "due".10 The system sorts these due items, prioritizing the lowest retrievability scores, and injects them into the session queue. This ensures the gamified experience is continuously optimizing the user's learning curve.
Technology Stack Selection and Architecture
The project specifications require a popular, highly modular JavaScript framework that prioritizes simplicity and readability. The application must operate entirely in the browser, persisting state via local storage, while supporting a modern development pipeline with live previews and integrated testing frameworks.
Frontend Framework: Svelte and SvelteKit
The architectural decision to employ Svelte and its meta-framework, SvelteKit, over traditional solutions like React or Vue is rooted in its compile-time optimization. React and Vue rely on a Virtual Document Object Model (VDOM) to track state changes, shipping a substantial runtime engine to the client's browser.15 Svelte, conversely, operates as a compiler. It analyzes the application's declarative components during the build phase and translates them into highly optimized, surgically updating vanilla JavaScript modules.16
This compiler-first approach eliminates the VDOM overhead, resulting in dramatically smaller bundle sizes and superior execution speeds.16 For an educational application demanding instantaneous validation feedback, fluid gamified transitions, and real-time keystroke interception for virtual keyboards, Svelte provides an unparalleled developer experience and end-user performance profile.20
Svelte's inherent modularity aligns perfectly with the project's requirements. Svelte components encapsulate markup, logic, and styling within a single .svelte file.21 The cascading style sheets (CSS) defined within these components are scoped by default, preventing visual leakage across the application and ensuring that complex elements—such as the virtual accent keyboard or the dynamic input fields—remain completely self-contained and easily maintainable.21 SvelteKit augments this by providing an opinionated, file-based routing architecture. The four required screens will map directly to specific route directories, establishing a clean separation of concerns.18
Framework Evaluation
React
Vue
Svelte / SvelteKit
Architecture
Virtual DOM runtime library.
Virtual DOM runtime framework.
Compile-time component framework.
Performance
High overhead for simple apps.
Moderate overhead.
Extremely lightweight, fast execution.
State Management
Complex hook dependency arrays.
Reactive proxies (Composition API).
Native reactive declarations ($state).
Modularity
JSX based, requires CSS-in-JS.
Single File Components (SFCs).
Single File Components (SFCs) with default scoped CSS.
Suitability
Over-engineered for target scope.
Strong candidate, slightly heavier.
Optimal. Meets all requirements for speed and modularity.

Build Tooling and Pipeline: Vite
SvelteKit is built natively on top of Vite, a next-generation frontend tooling ecosystem.18 Vite leverages native ECMAScript modules in the browser to provide a development server with near-instantaneous startup times and highly responsive Hot Module Replacement (HMR).26 This satisfies the requirement for a seamless live preview environment. For the production pipeline, Vite utilizes Rollup to bundle the application, applying advanced tree-shaking and minification algorithms to ensure the final deployment is highly performant.26
State Persistence: Local Storage Integration
Given the explicit requirement to persist the game state without a backend database, the HTML5 localStorage API will serve as the primary data repository. To manage this effectively within the Svelte architecture, the application will utilize Svelte 5's native reactivity mechanisms (runes) wrapped in custom synchronization logic.
The application state will be divided into discrete slices. The UserConfig slice will store preferred tenses, pronouns, and auxiliary visual options. The Gamification slice will track high scores, longest streaks, and the history of the last five session configurations. Finally, the SRS_Database slice will house the serialized JSON object mapping the verb:tense:person compound keys to their FSRS scheduling data.5 Whenever a user answers a question or completes a session, the relevant state slice updates reactively in the DOM, and a debounced function serializes the updated state into a JSON string, pushing it securely to window.localStorage.
Testing Ecosystem: Vitest and Playwright
A robust educational application requires rigorous testing to ensure algorithmic accuracy and user interface reliability. The Vite ecosystem integrates seamlessly with modern testing frameworks.27
Vitest: Serving as the unit testing framework, Vitest is optimized for the Vite pipeline. It will be deployed to test isolated algorithmic logic. Exhaustive unit tests will be written for the FSRS scheduling calculations to guarantee that spacing intervals decay and expand correctly.24 Similarly, the input validation and hint-generation algorithms will be isolated and subjected to edge-case testing.
Playwright: For end-to-end (E2E) testing, Playwright will automate a Chromium browser instance to simulate realistic user journeys. Playwright tests will verify the complete application flow: initiating a session on the Start Screen, configuring parameters on the Create Session screen, inputting answers on the Learning Screen, and verifying the correct statistics on the Game Over screen.24
User Interface and Gamification Mechanics
The user interface must translate complex linguistic tasks into a fluid, stress-free gamified loop. The graphics will be implemented using a utility-first CSS framework (such as Tailwind CSS) to ensure a minimalist, highly readable aesthetic that focuses cognitive load entirely on the linguistic content. The application is divided into four distinct routing views.
Screen 1: The Start Screen
The Start Screen functions as the user's primary dashboard. Upon initialization, it queries local storage to retrieve and prominently display the user's all-time high score, representing their longest consecutive streak across all sessions. Below the high score, a dynamic list interface presents the last five configured sessions. Each entry details the tenses and parameters used. Clicking an entry bypasses the configuration phase and immediately launches a new session with those exact parameters, fulfilling the requirement for rapid replayability. A prominent, primary call-to-action button labeled "Start Fresh Session" routes the user to the configuration interface.
Screen 2: The Create Session Screen
This screen empowers the user to define the precise linguistic boundaries and difficulty of their upcoming learning loop. The interface is dominated by a grid of toggleable pill buttons. One axis allows the selection of specific tenses (e.g., Present, Preterite, Imperfect), while the other axis permits the selection of specific persons (e.g., yo, tú, nosotros).
Below the linguistic selectors, the gamification configuration is presented. A toggle switch allows the user to alternate between "Strike Mode" and "Stress-Free Mode". If "Strike Mode" is active, a numeric input field appears, defaulting to three, allowing the user to dictate their margin of error. If "Stress-Free Mode" is selected, the strike input is hidden.
Finally, auxiliary visual options are presented as checkboxes, allowing the user to toggle "Show English Translation" and "Show Base Verb Form". Upon clicking the "Start" button, the application freezes the configuration, passes the parameters to the FSRS querying engine to build a queue of due sentences, and routes the user to the Learning Screen.
Screen 3: The Learning Screen
The Learning Screen is the interactive core of the application, divided logically into a top-level Score Section and a central Question Section.
The Score Section:
This persistent top bar provides real-time gamification feedback. It tracks the current question number, establishing a sense of progression. The "Strikes Left" counter displays the remaining margin of error (e.g., "2 of 3 strikes remaining"); this element is dynamically unmounted from the DOM if "Stress-Free Mode" was activated. Additionally, it displays the user's longest previous streak, providing an immediate target to beat.
The Question Section: The central interface presents the target Spanish sentence. The verb to be conjugated is entirely omitted, replaced by an HTML text input field seamlessly integrated into the sentence structure. This design clearly indicates the form and context of the missing verb. If the user configured the session to show the base form, the infinitive is displayed in parentheses immediately following the input field (e.g., "Mañana, nosotros [input field] (viajar) a la playa"). If the translation option was selected, the full English equivalent is rendered below the Spanish sentence in a significantly smaller, muted typography, ensuring it provides context without dominating the visual hierarchy.2
Interactive Mechanics and Virtual Keyboard:
The user interacts with the input field by typing the conjugated verb. Pressing the physical "Enter" key on their keyboard, or clicking the on-screen "Next" button, triggers the validation logic. If the string matches the expected answer, the streak increments, the FSRS algorithm records a successful recall, and the next sentence in the queue is rendered. If the input is incorrect, the strike counter decrements, the correct answer flashes in a high-contrast color (e.g., red) to provide immediate corrective feedback, and the algorithm records a failure before advancing.
To resolve the friction of typing specific Spanish characters (such as á, é, í, ó, ú, ñ), a custom Svelte component representing a virtual keyboard is implemented.28 This component is programmed with an event listener that detects when the primary input field gains focus. Upon focus, or when the user hovers near the input area, the minimalist keyboard fades into view directly beneath the input field.30 When a user clicks a virtual key, a dispatch event appends the specific accent character to the input field's bound value and programmatically forces the browser focus back to the input field, ensuring the user's typing rhythm is uninterrupted.
The Hint Mechanic:
The "Hint" button provides scaffolding for users struggling with a specific conjugation. The algorithm driving this button is meticulous: it analyzes the user's current input string and compares it character-by-character against the target answer. If the user has typed correct characters starting from the first letter, the algorithm preserves them. It aggressively strips away any incorrect trailing characters the user may have guessed, and then appends the next correct letter in the sequence. Utilizing this button flags the interaction for the spaced repetition system, ensuring the word is reviewed sooner.
Screen 4: The Game Over Screen
This screen interrupts the learning loop when a termination condition is met—either the strike counter reaches zero or the user exhausts the session's queue. The interface presents a clear, satisfying summary of the run. It displays the final streak achieved, a breakdown of correct versus incorrect inputs, and triggers a visual celebration if the user surpassed their all-time high score.
Behind the scenes, the application finalizes the serialization of the updated FSRS data and appends the session's configuration parameters to the local storage history array. The user is presented with two primary navigation options: "Try Again," which instantly reboots the session using the exact same queue and parameters, or "Go to Menu," which routes them back to the Start Screen dashboard.
Artificial Intelligence Data Pipeline and CLI Generation
A critical vulnerability in traditional language learning applications is the reliance on finite, hardcoded databases. Users quickly memorize the specific sentences rather than mastering the underlying grammatical rules. To solve this, the application architecture includes a Node.js-based Command Line Interface (CLI) tool. This tool leverages Large Language Models (LLMs) to generate fresh, highly contextual, and varied practice sentences for any verb on demand.
Structured JSON Prompting
LLMs are inherently probabilistic text generators, prone to conversational filler and inconsistent formatting. To seamlessly ingest AI-generated content into the application's JavaScript logic, the output must be strictly structured. The CLI tool utilizes JSON Schema Prompting, a technique that forces the LLM to abandon conversational prose and serialize its output as raw, machine-readable JavaScript Object Notation (JSON).31
By utilizing APIs that support JSON mode (e.g., OpenAI's response_format: { type: "json_object" }), the CLI ensures that the AI behaves as a predictable data processor.33 However, to guarantee data integrity, the CLI pipeline passes the LLM output through a strict schema validation library, such as Zod. If the AI hallucinates a key or provides an invalid tense, the Zod parser intercepts the failure, discards the payload, and automatically retries the prompt.32
The Generation Prompt
The prompt engineered for the other autonomous agent to execute via the CLI establishes a strict persona, defines the linguistic parameters, and explicitly dictates the JSON structure.31
SYSTEM PROMPT:
You are an expert computational linguist and Spanish language educator. Your objective is to generate practice sentences for a digital learning application.
For the target verb provided, generate exactly 3 distinct, contextual examples for every combination of TENSE and PERSON requested.
Each sentence must clearly indicate its form and make the context of the missing verb obvious. Use everyday vocabulary appropriate for language learners.
You must reply ONLY with a valid, raw JSON object containing an array named "exercises". Do not include markdown formatting, explanations, or conversational text.
The JSON objects MUST adhere strictly to the following schema:
{
"exercises":
}
File Structure and Workflow
The CLI tool will output the validated JSON data into a simple, flat file structure within the SvelteKit project repository. This avoids the need for complex database management while allowing the application to import the data locally.
/data
/verbs
hablar.json
comer.json
dormir.json
ser.json
registry.json
The registry.json file serves as a manifest, listing all available verbs and the tenses currently generated for them. When a developer wishes to expand the application's lexicon, they execute a command such as npm run generate:verb -- --verb="tener" --tenses="Present,Preterite,Imperfect". The CLI reads the parameters, injects them into the prompt, interfaces with the LLM API, validates the returned tener.json payload, and saves it directly to the /data/verbs/ directory. Upon the next build, SvelteKit statically imports these files, making the new sentences instantly available to the user.
Phased Development and Implementation Plan
To guarantee architectural integrity and maintain high testing coverage, the development of the application is decomposed into sequential stages. Each stage focuses on delivering a specific, testable layer of functionality, gradually building toward the complete gamified experience.24 Version control (Git) must be strictly maintained throughout development, ensuring atomic commits are made at the conclusion of each stage (or sub-components of stages) for robust traceability.
Stage 1: Repository Initialization and Core Architecture
Objective: Establish the foundational SvelteKit ecosystem, styling framework, and testing pipelines.
Implementation:
Execute the scaffolding command: npx sv create spanish-verbs-app. Select the skeleton project template, enforce TypeScript for type safety, and include Vitest and Playwright.
Install and configure Tailwind CSS to provide a utility-based styling foundation.
Establish the basic routing structure (src/routes/, src/routes/create/, src/routes/learn/, src/routes/summary/).
Documentation: Document the development commands in the README (npm run dev for the Vite server, npm run build for production).
Testing: Write a baseline Vitest suite to ensure the testing environment boots and executes correctly against a mathematical dummy function.
Stage 2: Artificial Intelligence CLI Pipeline
Objective: Build the developer tooling required to populate the application's linguistic database.
Implementation:
Create a Node.js script in scripts/generate.js.
Install necessary backend dependencies: npm install -D dotenv openai zod.
Define the strict Zod schema mirroring the JSON prompt structure to validate incoming LLM data.32
Implement the API request logic using the provided system prompt. Ensure the script writes successful payloads to the /data/verbs/ directory.
Documentation: Add a new script to package.json: "generate:verb": "node scripts/generate.js". Document its usage with flags.
Testing: Write unit tests for the Zod schema validation logic. Pass mock malformed JSON objects to the validator to assert that it correctly rejects them and triggers a failure state.
Stage 3: Spaced Repetition Engine and State Management
Objective: Implement the FSRS algorithm and connect the application state to browser local storage.
Implementation:
Install the scheduling library: npm install simple-ts-fsrs.36
Create a utility class src/lib/srs/scheduler.ts. Implement methods to initialize a card, grade a card (mapping UI events to FSRS scores 1-4), and calculate the next due date.5
Create Svelte $state runes in src/lib/stores/gameState.svelte.ts to hold the current user configuration, the strike count, and the active queue of sentences.
Implement loadFromStorage() and saveToStorage() functions that serialize the state and interact with window.localStorage.
Testing: Write comprehensive Vitest suites for the scheduler. Mock local storage states, pass synthetic interaction grades, and mathematically assert that the resulting stability metrics and due dates update correctly according to the FSRS model.5
Stage 4: Atomic UI Components and Interaction Logic
Objective: Build the interactive elements, specifically the virtual keyboard and the complex hint algorithm.
Implementation:
Develop src/lib/components/VirtualKeyboard.svelte. Utilize Svelte event dispatchers to send clicked characters to the parent component. Implement CSS focus-within states to control the hover/focus visibility.
Develop the hint logic in src/lib/utils/hintLogic.ts. The algorithm takes currentInput and targetVerb, finds the length of the matching prefix, truncates currentInput to that length, and appends targetVerb[prefixLength].
Testing: Mount the components in isolated testing environments. Write rigorous unit tests for the hint logic, passing various string combinations (e.g., input "hizi", target "hicieron") to assert the output correctly resolves to "hic".
Stage 5: Screen Orchestration and Gamification Loop
Objective: Connect the components, state, and data to finalize the four specific screens.
Implementation:
Start Screen: Wire up the UI to read from the local storage session history and high scores.
Create Session: Bind the toggle switches and linguistic grids to the application state. Implement the query logic that filters the /data JSON files and the FSRS database to build the active queue when "Start" is clicked.
Learning Screen: Assemble the Score Section and Question Section. Bind the input field to the validation logic. Implement the strike decrement logic and the conditional rendering for "Stress-Free Mode".
Game Over Screen: Implement the final statistical calculations and the routing buttons to restart or exit.
Testing: Utilize Playwright to write end-to-end integration tests. The automated browser will navigate to the Start Screen, configure a session, input mock answers on the Learning Screen, trigger a hint, fail intentionally to trigger a strike, and verify the resulting statistics on the Game Over screen.24
Stage 6: Polish, Deployment, and Production Build
Objective: Finalize the application architecture for deployment.
Implementation:
Run audits for accessibility (WCAG compliance) to ensure the high-contrast design and keyboard focus states function seamlessly.
Execute the Vite production build command (npm run build). Vite and Rollup will tree-shake the code, minify the assets, and produce a static directory ready for hosting on platforms like Vercel or Netlify.26
Testing: Run the full suite of Vitest and Playwright tests against the minified production build to guarantee runtime stability outside of the development environment.
Works cited
Modelos de conjugación verbal | Diccionario panhispánico de dudas, accessed April 1, 2026, https://www.rae.es/dpd/ayuda/modelos-de-conjugacion-verbal
Spanish Verb Tenses.pdf
joedel/spaced-repetition - Codesandbox, accessed April 1, 2026, https://codesandbox.io/s/joedelspaced-repetition-jekjz
Open Spaced Repetition - GitHub, accessed April 1, 2026, https://github.com/open-spaced-repetition
Free Spaced Repetition Scheduling Algorithm - GitHub, accessed April 1, 2026, https://github.com/open-spaced-repetition/free-spaced-repetition-scheduler
FSRS is one of the most accurate spaced repetition algorithms in the world (updated benchmark) : r/Anki - Reddit, accessed April 1, 2026, https://www.reddit.com/r/Anki/comments/1c29775/fsrs_is_one_of_the_most_accurate_spaced/
Enhancing human learning via spaced repetition optimization - PMC - NIH, accessed April 1, 2026, https://pmc.ncbi.nlm.nih.gov/articles/PMC6410796/
Spaced Repetition Algorithm: A Three‐Day Journey from Novice to Expert - GitHub, accessed April 1, 2026, https://github.com/open-spaced-repetition/fsrs4anki/wiki/spaced-repetition-algorithm:-a-three%E2%80%90day-journey-from-novice-to-expert
What spaced repetition algorithm does Anki use?, accessed April 1, 2026, https://faqs.ankiweb.net/what-spaced-repetition-algorithm
Simple spaced repetition algorithms mistreat expected failures - Andy Matuschak, accessed April 1, 2026, https://notes.andymatuschak.org/zKmMYFJ7xhbddLaxTfLYgdB
What is Spaced Repetition? A Step-by-Step Guide for Effective Language Learning, accessed April 1, 2026, https://www.heylama.com/blog/spaced-repetition
A Trainable Spaced Repetition Model for Language Learning - Duolingo Research, accessed April 1, 2026, https://research.duolingo.com/papers/settles.acl16.pdf
Master Your Memory: Building a Flashcard App with Spaced Repetition - DEV Community, accessed April 1, 2026, https://dev.to/learncomputer/master-your-memory-building-a-flashcard-app-with-spaced-repetition-3jbb
How to write your own spaced repetition algorithm - Fresh Cards, accessed April 1, 2026, https://freshcardsapp.com/srs/write-your-own-algorithm.html
Top 10 JavaScript Frameworks to Use in 2025 - GeeksforGeeks, accessed April 1, 2026, https://www.geeksforgeeks.org/javascript/top-javascript-frameworks/
Svelte vs Vue: Choosing the Best Front-End Framework - DEV Community, accessed April 1, 2026, https://dev.to/vijendra22/svelte-vs-vue-choosing-the-best-front-end-framework-2h79
Svelte Vs Vue: Choose The Best Front-End Framework - Programmers.io, accessed April 1, 2026, https://programmers.io/blog/svelte-vs-vue/
Introduction • SvelteKit Docs, accessed April 1, 2026, https://svelte.dev/docs/kit
Getting started with Svelte - Learn web development | MDN, accessed April 1, 2026, https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Frameworks_libraries/Svelte_getting_started
Top Frameworks for JavaScript App Development in 2025 - Strapi, accessed April 1, 2026, https://strapi.io/blog/frameworks-for-javascript-app-developlemt
I created a Quiz app using Svelte and now I cannot go back to any other framework., accessed April 1, 2026, https://dev.to/manan30/i-created-a-quiz-app-using-svelte-and-now-i-cannot-go-back-to-any-other-framework-1jeo
React vs Vue vs Svelte: Choosing the Right Framework for 2025 | by Frontend Highlights, accessed April 1, 2026, https://medium.com/@ignatovich.dm/react-vs-vue-vs-svelte-choosing-the-right-framework-for-2025-4f4bb9da35b4
07 - Basic Introduction To Components In Svelte 5 - YouTube, accessed April 1, 2026, https://www.youtube.com/watch?v=6QxIED34cjc
Project structure • SvelteKit Docs, accessed April 1, 2026, https://svelte.dev/docs/kit/project-structure
SvelteKit Project Structure Explained - Joy of Code, accessed April 1, 2026, https://joyofcode.xyz/sveltekit-project-structure
A Simple Guide to the Modern Vite Project Structure | by Ketan Damle | Medium, accessed April 1, 2026, https://medium.com/@koriigami/a-simple-guide-to-the-modern-vite-project-structure-9fbe8d137abf
Top JavaScript Frameworks to Master in 2025 for Developers - devChallenges, accessed April 1, 2026, https://devchallenges.io/blog/2-top-javascript-frameworks-to-learn-in-2025
How to Type Spanish Accents and Letters - SpanishDict, accessed April 1, 2026, https://www.spanishdict.com/guide/how-to-type-spanish-accents-and-letters
Keyboard customization for Spanish letters, accents, and punctuation : r/swaywm - Reddit, accessed April 1, 2026, https://www.reddit.com/r/swaywm/comments/12jdvru/keyboard_customization_for_spanish_letters/
Beginner's Guide to Accessibility With Svelte | by Kevin M - Medium, accessed April 1, 2026, https://medium.com/@kevinteaches/beginners-guide-to-accessibility-with-svelte-87291c2496dd
JSON prompting for LLMs - IBM Developer, accessed April 1, 2026, https://developer.ibm.com/articles/json-prompting-llms/
Mastering JSON Prompting for LLMs - MachineLearningMastery.com, accessed April 1, 2026, https://machinelearningmastery.com/mastering-json-prompting-for-llms/
How to generate structured data like JSON with LLM models? - GenAI Stack Exchange, accessed April 1, 2026, https://genai.stackexchange.com/questions/202/how-to-generate-structured-data-like-json-with-llm-models
Top 6 Validation libraries for JavaScript in 2025 - Devmystify, accessed April 1, 2026, https://devmystify.com/blog/top-6-validation-libraries-for-javascript-in-2025
Learn to Speak Spanish - Prompt Template - LLMBase, accessed April 1, 2026, https://llmbase.ai/prompts/learn-to-speak-spanish/
simple-ts-fsrs - Austin Shelby, accessed April 1, 2026, https://www.austinshelby.com/open-source/simple-ts-fsrs
