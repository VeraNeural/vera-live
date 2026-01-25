# VERA Accessibility Testing Task Scripts

> **Document ID:** A11Y-TASKS-001  
> **Version:** 1.0  
> **Last Updated:** January 25, 2026  

---

## How to Use This Document

Each task includes:
- **Prompt**: What to say to the participant
- **Observe**: Checklist of things to watch for
- **Probing questions**: Follow-up questions after task
- **Success criteria**: Definition of task success
- **VERA-specific notes**: Special considerations

Read prompts naturally, not robotically. Adapt language as needed while maintaining neutrality.

---

## Task Set 1: Onboarding & Authentication

### Task 1.1: Navigate to Homepage and Understand Purpose

**Prompt:**
> "You've just arrived at VERA's homepage. Please take a moment to explore and tell me what this application is for."

**Observe:**
- [ ] Page title announced clearly
- [ ] Skip link available and works
- [ ] Main heading conveys purpose
- [ ] Can identify key navigation areas
- [ ] Tagline/description accessible
- [ ] Crisis resources visible/announced

**Probing questions:**
- "What do you think this application does?"
- "Who do you think it's for?"
- "Was the purpose clear?"
- "Did you notice any resources for emergencies or crisis?"

**Success criteria:**
- Can articulate VERA's purpose within 2 minutes
- Identifies it as mental health/AI support

---

### Task 1.2: Create a New Account

**Prompt:**
> "Please create a new account to start using VERA. You can use any email address you like—we have test mode enabled."

**Observe:**
- [ ] Sign-up button/link easily found
- [ ] Sign-up form labels announced
- [ ] Required fields indicated accessibly
- [ ] Password requirements communicated
- [ ] Show/hide password toggle accessible
- [ ] Form validation errors announced and associated
- [ ] Success/completion clearly indicated
- [ ] Focus managed after submission

**Probing questions:**
- "How did you know what information to enter in each field?"
- "Were there any parts of the form that were unclear?"
- "Did you know when you successfully created your account?"
- "How were password requirements communicated?"

**Success criteria:**
- Completes signup within 5 minutes
- No critical barriers encountered
- Understands when account is created

**VERA-specific notes:**
- VERA uses Clerk for authentication
- May redirect to Clerk-hosted signup
- Watch for focus loss during authentication flow

---

### Task 1.3: Log In to an Existing Account

**Prompt:**
> "Please log out if you're logged in, then log back in using these credentials: [provide test credentials]"

**Observe:**
- [ ] Logout option findable
- [ ] Login form accessible
- [ ] Email/password fields labeled
- [ ] Password field properly identified as password
- [ ] Login button operable
- [ ] Error handling for wrong credentials
- [ ] Successful login clearly indicated
- [ ] Focus managed post-login

**Probing questions:**
- "How did you know you were logged in?"
- "Where was your focus after logging in?"
- "Was anything surprising about the login process?"

**Success criteria:**
- Logs in within 3 minutes
- Clearly knows they're authenticated

---

### Task 1.4: Password Reset Flow

**Prompt:**
> "Imagine you forgot your password. Please start the process to reset it. You don't need to complete the full process—just show me how you would begin."

**Observe:**
- [ ] "Forgot password" link findable
- [ ] Link properly announced
- [ ] Password reset page accessible
- [ ] Email input labeled
- [ ] Submit button operable
- [ ] Success/confirmation accessible

**Probing questions:**
- "How did you find the password reset option?"
- "Was it clear what would happen next?"

**Success criteria:**
- Finds and initiates reset within 2 minutes

---

## Task Set 2: Core Chat Interaction

### Task 2.1: Start a New Conversation

**Prompt:**
> "You're now logged in. Please start a new conversation with VERA by saying hello."

**Observe:**
- [ ] Chat interface located
- [ ] Input field has accessible label
- [ ] Input field receives focus appropriately
- [ ] Can type message
- [ ] Send button accessible (or Enter key works)
- [ ] Knows message was sent
- [ ] Loading/thinking state communicated
- [ ] Response announced/accessible
- [ ] Can distinguish user message from VERA response

**Probing questions:**
- "How did you know where to type your message?"
- "How did you send your message?"
- "How did you know your message was sent?"
- "How did you know when VERA responded?"
- "Could you tell the difference between your message and VERA's response?"

**Success criteria:**
- Sends first message within 2 minutes
- Knows message was sent
- Can access VERA's response

**VERA-specific notes:**
- Chat input should have clear label
- ARIA live region should announce new messages
- Streaming response should be handled accessibly

---

### Task 2.2: Read and Navigate the Conversation

**Prompt:**
> "Please read through the conversation so far and tell me what was discussed."

**Observe:**
- [ ] Messages are readable by screen reader
- [ ] Can navigate between messages
- [ ] Message sender is clear (user vs VERA)
- [ ] Timestamps accessible (if present)
- [ ] No content truncated or hidden
- [ ] Navigation method is efficient

**Probing questions:**
- "How did you know who sent each message?"
- "Was it easy to navigate through the conversation?"
- "Did you miss any content?"

**Success criteria:**
- Can accurately summarize conversation
- Identifies speakers correctly

---

### Task 2.3: Multi-Turn Conversation

**Prompt:**
> "Please have a brief conversation with VERA—about 3-4 exchanges. You might talk about stress, sleep, or anything you're comfortable with. You can make up a topic if you prefer."

**Observe:**
- [ ] Conversation flows naturally
- [ ] Each response announced appropriately
- [ ] No focus loss between messages
- [ ] Loading states communicated
- [ ] No interruption to input
- [ ] Can continue without reorienting
- [ ] Response time acceptable

**Probing questions:**
- "How was the flow of the conversation?"
- "Did anything interrupt you while chatting?"
- "Were you always sure what was happening?"
- "Did you feel like you could chat independently?"

**Success criteria:**
- Completes 3-4 exchanges
- Maintains understanding of conversation
- No major interruptions to flow

**VERA-specific notes:**
- VERA responses may stream—ensure this is accessible
- Crisis detection may trigger—observe accessibility of any alerts
- Session persistence should work

---

### Task 2.4: Create a New Conversation

**Prompt:**
> "Please start a completely new conversation—separate from this one."

**Observe:**
- [ ] New conversation option findable
- [ ] Clear feedback that new conversation started
- [ ] Previous messages not visible
- [ ] Can immediately start chatting

**Probing questions:**
- "How did you know you started a new conversation?"
- "Was it easy to find that option?"

**Success criteria:**
- Starts new conversation within 2 minutes
- Understands context is fresh

---

### Task 2.5: Access Conversation History

**Prompt:**
> "Please find a conversation you had earlier and open it."

**Observe:**
- [ ] Conversation history/list findable
- [ ] Conversations are listed accessibly
- [ ] Can identify conversations (titles, dates)
- [ ] Can select/open a conversation
- [ ] Historical messages load and are accessible

**Probing questions:**
- "How did you find your previous conversations?"
- "Could you tell which conversation was which?"
- "Were the past messages accessible?"

**Success criteria:**
- Finds and opens previous conversation within 3 minutes

---

## Task Set 3: Navigation & Information Architecture

### Task 3.1: Explore Main Navigation

**Prompt:**
> "Please explore the main sections of VERA and tell me what areas you can find."

**Observe:**
- [ ] Main navigation is accessible
- [ ] Navigation landmarks used
- [ ] Current section indicated
- [ ] All sections reachable
- [ ] Skip links work
- [ ] Logical navigation order

**Probing questions:**
- "What sections did you find?"
- "How did you know which section you were in?"
- "Was the navigation easy to understand?"

**Success criteria:**
- Identifies major sections
- Can navigate between sections

---

### Task 3.2: Find Settings/Preferences

**Prompt:**
> "Please find the settings or preferences area and explore what options are available."

**Observe:**
- [ ] Settings easily located
- [ ] Settings options accessible
- [ ] Toggle switches operable
- [ ] Dropdowns accessible
- [ ] Changes confirmed/feedback provided
- [ ] Settings organized logically

**Probing questions:**
- "Was the settings area easy to find?"
- "Were there any settings that were confusing?"
- "Could you tell when a setting was changed?"

**Success criteria:**
- Finds settings within 2 minutes
- Can adjust at least one setting

---

### Task 3.3: Access Account/Profile Information

**Prompt:**
> "Please find information about your account—like your email address or subscription status."

**Observe:**
- [ ] Account area findable
- [ ] Personal info readable
- [ ] Subscription status clear
- [ ] Edit options accessible (if present)

**Probing questions:**
- "Was your account information easy to find?"
- "Could you read all the information?"
- "Is anything unclear about your account?"

**Success criteria:**
- Finds account info within 2 minutes
- Can report their email or subscription status

---

## Task Set 4: Safety & Crisis Features

⚠️ **Note:** These tasks test critical safety features. Handle sensitively.

### Task 4.1: Find Crisis Resources

**Prompt:**
> "If someone using VERA was having a very difficult time and needed immediate help, where would they find resources?"

**Observe:**
- [ ] Crisis resources findable
- [ ] Phone numbers are accessible links
- [ ] 988 (Suicide & Crisis Lifeline) prominent
- [ ] Resources clearly labeled
- [ ] Can activate crisis links
- [ ] Multiple pathways to crisis resources

**Probing questions:**
- "How quickly did you find crisis resources?"
- "Were the phone numbers easy to call from here?"
- "Is there anywhere else you saw crisis information?"

**Critical success criteria:**
- ⚠️ Finds crisis resources within 90 seconds
- ⚠️ Can activate phone link
- ⚠️ Numbers are correctly formatted

**VERA-specific notes:**
- Crisis resources should be on every page footer
- 988 should be prominent
- Links should use tel: protocol

---

### Task 4.2: Understand VERA's Limitations

**Prompt:**
> "Please find information about what VERA can and cannot help with—where would you learn about its limitations?"

**Observe:**
- [ ] Disclaimer/about information findable
- [ ] Medical disclaimer accessible
- [ ] Clear that VERA is not a replacement for professional help
- [ ] Links to full legal pages work

**Probing questions:**
- "What did you learn about VERA's limitations?"
- "Was this information easy to find?"
- "Was it clear that VERA is not a medical provider?"

**Success criteria:**
- Finds limitation information within 3 minutes
- Can articulate key limitations

---

## Task Set 5: Premium Features & Payments

### Task 5.1: Explore Upgrade Options

**Prompt:**
> "Please explore the options for upgrading to a paid subscription. Don't actually pay—just explore what's available."

**Observe:**
- [ ] Upgrade path findable
- [ ] Plan options accessible
- [ ] Pricing information readable
- [ ] Feature comparison accessible
- [ ] Can proceed to payment (without completing)

**Probing questions:**
- "What plans are available?"
- "What features do you get with each plan?"
- "Was the pricing clear?"

**Success criteria:**
- Finds upgrade options within 2 minutes
- Can describe plan differences

---

### Task 5.2: Payment Form (Optional - Stripe test mode)

**Prompt:**
> "Using this test card number [4242 4242 4242 4242], please proceed through the payment form. We're in test mode so no real charge will occur."

**Observe:**
- [ ] Payment form accessible
- [ ] Card fields labeled
- [ ] Expiry/CVC fields accessible
- [ ] Form validation accessible
- [ ] Submit button operable
- [ ] Confirmation accessible

**Probing questions:**
- "Were the payment fields clear?"
- "Was there anything confusing about the payment process?"

**Success criteria:**
- Completes test payment form
- Payment confirmation accessible

---

## Task Set 6: Voice Features (If Applicable)

### Task 6.1: Find Voice Interaction

**Prompt:**
> "VERA may have voice features. Please find and try to activate voice input or output."

**Observe:**
- [ ] Voice controls findable
- [ ] Buttons properly labeled
- [ ] Visual feedback when active
- [ ] Can activate/deactivate
- [ ] Works with screen reader

**Probing questions:**
- "How did you find the voice feature?"
- "Was it clear how to start and stop it?"
- "Did it work well with your assistive technology?"

---

## Task Set 7: Data & Privacy

### Task 7.1: Export Your Data

**Prompt:**
> "Please find how you would export or download your data from VERA."

**Observe:**
- [ ] Data export findable
- [ ] Process explained accessibly
- [ ] Can initiate export
- [ ] Confirmation accessible

**Probing questions:**
- "Was the data export easy to find?"
- "Did you understand what would be exported?"

---

### Task 7.2: Delete Your Account

**Prompt:**
> "Please find how you would delete your account if you wanted to. Don't actually delete it—just find the option."

**Observe:**
- [ ] Account deletion findable
- [ ] Warnings/confirmations accessible
- [ ] Process is clear

**Probing questions:**
- "Was the delete option easy to find?"
- "Were the consequences clear?"

---

## Task Set 8: Error Handling

### Task 8.1: Form Validation Error

**Prompt:**
> "Please try to send an empty message or submit a form with missing information, and see how the application responds."

**Observe:**
- [ ] Error message appears
- [ ] Error announced by screen reader
- [ ] Error associated with relevant field
- [ ] Clear how to fix error
- [ ] Can recover and continue

**Probing questions:**
- "How did you know there was an error?"
- "Was it clear what was wrong?"
- "Could you fix it easily?"

---

### Task 8.2: Character/Message Limit

**Prompt:**
> "Please try sending a very long message—you can copy-paste this text multiple times: [provide long text]. See what happens."

**Observe:**
- [ ] Limit feedback provided
- [ ] Error or warning accessible
- [ ] Clear how to proceed
- [ ] No content lost unexpectedly

---

## Task Set 9: Open Exploration

### Task 9.1: Free Exploration (10 minutes)

**Prompt:**
> "Please spend the next 10 minutes exploring VERA however you'd like. Try any features that interest you, and continue thinking aloud about your experience."

**Observe:**
- Everything from previous tasks
- New issues in unexplored areas
- Natural usage patterns
- Features participant gravitates toward
- Pain points in natural flow

**After exploration, ask:**
- "What did you find most interesting?"
- "Did you encounter anything surprising?"
- "Was there anything you couldn't figure out how to do?"
- "What would you want to try that you couldn't find?"

---

## Appendix: Task Difficulty and Priority

| Task | Difficulty | Priority for Testing | Skip if Short on Time |
|------|------------|---------------------|----------------------|
| 1.1 Homepage | Easy | High | No |
| 1.2 Sign Up | Medium | High | No |
| 1.3 Log In | Easy | High | No |
| 1.4 Password Reset | Medium | Medium | Yes |
| 2.1 Start Chat | Easy | Critical | No |
| 2.2 Read Chat | Easy | Critical | No |
| 2.3 Multi-turn | Medium | Critical | No |
| 2.4 New Conversation | Easy | High | Yes |
| 2.5 History | Medium | High | Yes |
| 3.1 Navigation | Medium | High | No |
| 3.2 Settings | Medium | Medium | Yes |
| 3.3 Account | Easy | Medium | Yes |
| 4.1 Crisis Resources | Easy | **Critical** | **Never** |
| 4.2 Limitations | Medium | High | Yes |
| 5.1 Upgrade | Medium | Medium | Yes |
| 5.2 Payment | Hard | Low | Yes |
| 6.1 Voice | Medium | Medium | Yes |
| 7.1 Data Export | Medium | Medium | Yes |
| 7.2 Delete Account | Easy | Low | Yes |
| 8.1 Error Handling | Medium | High | Yes |
| 8.2 Limits | Easy | Medium | Yes |
| 9.1 Free Exploration | N/A | High | No |

---

*Adapt tasks based on participant's time, fatigue, and the specific features being tested.*
