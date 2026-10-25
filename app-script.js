/* ChatMula PWA client. Uses the existing Supabase project and public anon key only. */
'use strict';
const API='https://hiftjunvppgrlmdcvleo.supabase.co';
const KEY='sb_publishable_rY8X9teF9-Uxy_bb__DGDA_KBCag4RB';
const $=s=>document.querySelector(s);const app=$('#app');
const state={page:'',user:null,profile:null,token:localStorage.getItem('cm_token')||'',refresh:localStorage.getItem('cm_refresh')||'',uid:localStorage.getItem('cm_uid')||'',username:localStorage.getItem('cm_username')||'',email:localStorage.getItem('cm_email')||'',ref:localStorage.getItem('cm_ref')||new URLSearchParams(location.search).get('ref')||'',messages:[],bot:null,botHistory:[],pollTimer:null,botReplyTimer:null,botTyping:false};

// STRENGTHEN REFERRAL LOGIC: Capture URL ref immediately and save to localStorage
const urlRef = new URLSearchParams(location.search).get('ref');
if (urlRef) {
    state.ref = urlRef.trim().toUpperCase();
    localStorage.setItem('cm_ref', state.ref);
}

// Variables for the Withdrawal Modal
let pendingWithdrawalData = null;

const bots=[["Alex Carter","male","USA","4.7","bot_alex_carter.jpg",["Hey  How has your day been so far?","What do you normally enjoy doing when you finally get some quiet time?","I like that. People usually reveal a lot about themselves through the little things they enjoy.","What kind of music fits your mood when you want to relax?","If tomorrow was completely free, how would you spend it?","Would you rather have a long conversation at night or a quick chat during the day?"],"Alex","Swahili beginner"],["Jordan Brooks","male","Canada","4.6","bot_jordan_brooks.jpg",["Yo  What has been keeping you busy today?","Are you more into football, music, movies, gaming, business, tech, or something completely different?","What team do you support, if you follow football?","Football conversations can get serious very quickly . Who is your favourite player?","What is the last movie or series that actually held your attention?","What kind of music do you play when you are in a good mood?"],"Jordan","Swahili beginner"],["Morgan Bennett","male","UK","4.5","bot_morgan_bennett.jpg",["What's up  How is your day going?","Are you usually the person who starts conversations or waits for someone else?","What makes a conversation instantly interesting for you?","Are you into sports? If yes, which one?","What is the most competitive thing you have ever done?","Do you enjoy business and money topics, or do you avoid them?"],"Morgan","Swahili beginner"],["Sam Reid","male","Canada","4.8","bot_sam_reid.jpg",["Hi  How are you feeling today?","What usually helps you relax when life gets busy?","Do you enjoy quiet places or busy environments more?","What is your favourite kind of evening?","Do you like listening to other people's stories?","What is one story from your life that always makes people laugh?"],"Sam","Swahili beginner"],["Charlie Mitchell","male","USA","4.4","bot_charlie_mitchell.jpg",["Hey  What is happening on your side?","What is your favourite way to spend a free evening?","Do you follow football or another sport?","Who is your favourite team or player?","What food would you order without even checking the menu?","Do you enjoy cooking or are you better at finding good places to eat? "],"Charlie","Swahili beginner"],["Ethan Walsh","male","USA","4.6","bot_ethan_walsh.jpg",["Hey  How's your day been?","What do you usually get up to when you're not working?","I like that. People always surprise me with what they enjoy.","Is there a place you've been wanting to visit for a while?","If you had a completely free weekend, what would you do?","What's one thing you've been thinking about lately?"],"Ethan","Swahili beginner"],["Liam Foster","male","UK","4.5","bot_liam_foster.jpg",["Hey there  what's keeping you busy today?","Are you more of a morning person or a night owl?","I find that says a lot about someone.","What kind of music do you have on repeat lately?","If money weren't a concern, what would you spend your time doing?","What's something small that always cheers you up?"],"Liam","Swahili beginner"],["Noah Sinclair","male","Canada","4.8","bot_noah_sinclair.jpg",["Hey  how's everything going?","What do you do when you need to recharge?","I feel like rest is underrated these days.","Do you prefer quiet nights in or going out with friends?","What's a hobby you've picked up recently?","What's something you're really proud of, even if it seems small?"],"Noah","Swahili beginner"],["Caleb Rhodes","male","USA","4.4","bot_caleb_rhodes.jpg",["Hey  what's up?","Got any plans for the week?","Nice. I like hearing what people are into.","Do you follow any sports, or not really your thing?","What kind of food could you eat any day?","What's the best thing that happened to you this week?"],"Caleb","Swahili beginner"],["Mason Clarke","male","UK","4.7","bot_mason_clarke.jpg",["Hey  how's your day treating you?","What's something you've been working on lately?","That sounds interesting. What's the hardest part?","Do you like being busy or do you prefer calmer days?","If you could learn one skill instantly, what would it be?","What's one thing you'd like to change about your routine?"],"Mason","Swahili beginner"],["Taylor Parker","female","UK","4.9","bot_taylor_parker.jpg",["Hi  What kind of day are you having?","What usually makes you feel comfortable with someone new?","I think being able to laugh together helps a lot.","What is your favourite kind of conversation?","Would you rather spend a weekend near the ocean or somewhere quiet inland?","If you could travel anywhere tomorrow, where would you go?"],"Taylor","Swahili beginner"],["Riley Price","female","USA","4.6","bot_riley_price.jpg",["Hello  How are things on your side today?","Are you a morning person or do you become more energetic at night?","What is the first thing you usually do when you get home?","What kind of food do you never get tired of?","Do you cook often or prefer someone else to handle the kitchen?","What Kenyan place would you happily visit again?"],"Riley","Swahili beginner"],["Casey Collins","female","Canada","4.7","bot_casey_collins.jpg",["Hey  What has made you smile today?","What kind of things do you enjoy talking about with new people?","Are you more interested in music, movies, food, travel, or random stories?","What song have you played more than once recently?","Do you have a favourite place to relax?","What would your ideal Saturday look like?"],"Casey","Swahili beginner"],["Jamie Grant","female","UK","4.5","bot_jamie_grant.jpg",["Hey there  What are you up to today?","What kind of personality do you normally click with?","Are you naturally talkative or quiet until you know someone?","What kind of music would you play on a road trip?","If you could take a road trip tomorrow, where would you go?","What snack would definitely come along for the ride? "],"Jamie","Swahili beginner"],["Avery Hayes","female","USA","4.8","bot_avery_hayes.jpg",["Hey, how are you doing?","What is keeping you busy these days?","Do you enjoy your work, or is it mainly something that pays the bills?","What kind of career would you choose if money was not a concern?","What skill do you think everyone should learn?","Are you interested in technology or do you prefer keeping things simple?"],"Avery","Swahili beginner"],["Olivia Stone","female","Canada","4.9","bot_olivia_stone.jpg",["Hi  how are you feeling today?","What's been on your mind this week?","I love that. Sometimes the simple things stick with us.","What do you do to unwind after a long day?","Is there a song that always lifts your mood?","What's something kind someone has done for you recently?"],"Olivia","Swahili beginner"],["Emma Hart","female","USA","4.7","bot_emma_hart.jpg",["Hey  what's going on with you today?","Are you into movies, music, or something else entirely?","I like a good mix — depends on the mood.","What's the last thing that made you laugh out loud?","Do you enjoy cooking, or is that not really your thing?","What's one goal you're working toward right now?"],"Emma","Swahili beginner"],["Sophie Lane","female","UK","4.6","bot_sophie_lane.jpg",["Hi  how's your week going?","Are you close with your family, or more independent?","Both are valid — depends on the people, I think.","What do you value most in a friendship?","Do you like travelling, or are you more of a homebody?","What's something you'd love to try if you had the chance?"],"Sophie","Swahili beginner"],["Chloe Vance","female","Canada","4.8","bot_chloe_vance.jpg",["Hey there  how are you doing?","What's something you've been curious about lately?","I love that. Curiosity keeps life interesting.","Do you prefer deep conversations or lighter ones?","What's one thing you wish people asked you more often?","What's a memory that always makes you smile?"],"Chloe","Swahili beginner"],["Mia Winters","female","USA","4.5","bot_mia_winters.jpg",["Hi  what have you been up to?","Are you a planner or do you go with the flow?","I feel like each has its place, honestly.","What's your favourite way to spend a quiet evening?","Do you have a favourite place in the world?","What's one thing you'd like to be better at?"],"Mia","Swahili beginner"]];

function orderedBots(){
 const key='cm_bot_order_'+(state.uid||'guest');
 try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(Array.isArray(saved)&&saved.length===bots.length){const byName=new Map(bots.map(b=>[b[0],b]));const ordered=saved.map(n=>byName.get(n)).filter(Boolean);if(ordered.length===bots.length)return ordered}}catch{}
 const ordered=bots.slice();for(let i=ordered.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ordered[i],ordered[j]]=[ordered[j],ordered[i]]}
 try{localStorage.setItem(key,JSON.stringify(ordered.map(b=>b[0])))}catch{}return ordered;
}
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3200)}
function showConnectionBanner(message='Reconnect to the internet to book or chat. Your current conversation is still on this device.',online=false){const b=$('#connectionBanner');if(!b)return;b.hidden=false;b.classList.toggle('online',!!online);$('#connectionTitle').textContent=online?'Connection restored':'No internet connection';$('#connectionMessage').textContent=message}
function hideConnectionBanner(){const b=$('#connectionBanner');if(b)b.hidden=true}

function showActivationWall(){if(document.querySelector('.activation-wall'))return;const layer=document.createElement('div');layer.className='activation-wall';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-labelledby','activationWallTitle');layer.innerHTML=`<div class="activation-dialog"><h2 id="activationWallTitle">Activate your account</h2><p>Pay a one-time activation fee with M-Pesa to unlock chat and earnings.</p><div class="activation-actions"><button class="btn full" id="payActivationWall">Pay activation</button></div></div>`;document.body.appendChild(layer);$('#payActivationWall').onclick=()=>{layer.remove();navigate('activate')}}

function saveAuth(data){state.token=data.access_token||state.token;state.refresh=data.refresh_token||state.refresh;state.uid=data.user?.id||state.uid;const meta=data.user?.user_metadata||{};state.username=meta.username||state.username;state.email=data.user?.email||state.email;state.ref=meta.referral_code||state.ref;for(const [k,v] of Object.entries({cm_token:state.token,cm_refresh:state.refresh,cm_uid:state.uid,cm_username:state.username,cm_email:state.email,cm_ref:state.ref}))if(v)localStorage.setItem(k,v)}
function logout(){for(const k of ['cm_token','cm_refresh','cm_uid','cm_username','cm_email','cm_ref'])localStorage.removeItem(k);Object.assign(state,{token:'',refresh:'',uid:'',username:'',email:'',profile:null});renderAuth()}
async function req(path,{method='GET',body,token=state.token,prefer}={}){const headers={'Content-Type':'application/json','Accept':'application/json','apikey':KEY};if(token)headers.Authorization='Bearer '+token;else headers.Authorization='Bearer '+KEY;if(prefer)headers.Prefer=prefer;let res;try{res=await fetch(API+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)})}catch(e){if(typeof showConnectionBanner==='function')showConnectionBanner('Could not reach ChatMula. Check your data or Wi-Fi and try again.');throw new Error('Network error. Check your internet connection and try again.')}const text=await res.text();let data;try{data=text?JSON.parse(text):null}catch{data=text}if(!res.ok){if(res.status===401&&state.refresh&&path!=='/auth/v1/token?grant_type=refresh_token'){try{const fresh=await req('/auth/v1/token?grant_type=refresh_token',{method:'POST',token:KEY,body:{refresh_token:state.refresh}});saveAuth(fresh);return req(path,{method,body,token:state.token,prefer})}catch{}}throw new Error(data?.message||data?.msg||data?.error_description||data?.error||`Request failed (${res.status})`)}return data}
async function signIn(email,password){const d=await req('/auth/v1/token?grant_type=password',{method:'POST',token:KEY,body:{email,password}});saveAuth(d);try{await loadProfile()}catch(e){state.profile=null;console.warn('Profile could not be loaded; showing chatbot list anyway:',e)}renderHome();if(!state.profile)toast('You are signed in. Some account details could not load, but you can still view chatbots.')}
async function loadProfile(){if(!state.uid||!state.token)return null;const rows=await req('/rest/v1/profiles?id=eq.'+encodeURIComponent(state.uid)+'&select=*');state.profile=Array.isArray(rows)?rows[0]||null:null;return state.profile}
function fmt(n){return 'KSh '+Number(n||0).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}
function shell(content,active='bots'){
 const chatScreen=active==='bot'||active==='chat'||active==='public';app.innerHTML=`<main class="wrap ${chatScreen?'chat-screen':''}"><h1 class="chats-title">${active==='bots'||active==='bot'?'Chats':active==='chat'||active==='public'?'Public Chat':active==='wallet'?'Wallet':active==='invite'?'Invite':active==='account'?'Account':active==='activate'||active==='waiting'?'Activate your account':'Chats'}</h1>${content}</main><nav class="nav"><button data-page="chat" class="${active==='bots'||active==='bot'||active==='chat'||active==='public'?'active':''}"><b aria-hidden="true"></b><span>Chat</span></button><button data-page="wallet" class="${active==='wallet'?'active':''}"><b aria-hidden="true"></b><span>Wallet</span></button><button data-page="invite" class="${active==='invite'?'active':''}"><b aria-hidden="true"></b><span>Invite</span></button></nav>`;
 app.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>navigate(b.dataset.page));
}
function renderAuth(){
 state.page='welcome';
 app.innerHTML=`<main class="splash"><img src="icon.jpg" alt="ChatMula"><h1>CHATMULA</h1><p>Chat. Earn. Connect.</p><div class="spinner" aria-label="Loading"></div></main>`;
 setTimeout(()=>{if(state.page==='welcome')renderAuthChoice()},1500);
}
function renderAuthChoice(){
 state.page='auth-choice';
 app.innerHTML=`<main class="auth choice"><div class="choice-inner"><h1>Welcome to ChatMula</h1><p class="muted center">Log in to your account or create a new one.</p><button class="btn full" id="openSignup">Register</button><button class="btn secondary full" id="openLogin">Login</button><button class="btn intro full" id="watchIntro"> Back to intro video</button></div></main>`;
 $('#openSignup').onclick=()=>renderAuthForm('signup');
 $('#openLogin').onclick=()=>renderAuthForm('login');
 $('#watchIntro').onclick=()=>{state.page='welcome';app.innerHTML=`<main class="splash"><img src="icon.jpg" alt="ChatMula"><h1>CHATMULA</h1><p>Chat. Earn. Connect.</p><div class="spinner" aria-label="Loading"></div></main>`;setTimeout(()=>{if(state.page==='welcome')renderAuthChoice()},1500)};
}
function renderAuthForm(mode){
 state.page=mode==='signup'?'signup':'login';
 const signup=mode==='signup';
 app.innerHTML=`<main class="auth"><div class="auth-brand"><div class="wordmark">CHATMULA</div>${signup?'<div class="tagline">Chat. Earn. Connect.</div>':'<div class="login-subtitle">Welcome back</div>'}</div><section class="auth-form-wrap"><div id="authError" class="notice error hidden"></div><form id="authForm" novalidate>${signup?`<div class="field"><input id="username" autocomplete="username" minlength="3" maxlength="24" pattern="[A-Za-z0-9_]{3,24}" placeholder="Username" aria-label="Username" required></div>`:''}<div class="field"><input id="email" type="email" required autocomplete="email" placeholder="Email" aria-label="Email"></div><div class="field"><input id="password" type="password" required minlength="6" autocomplete="${signup?'new-password':'current-password'}" placeholder="${signup?'Password (min 6)':'Password'}" aria-label="Password"></div>${signup?`<label class="show-password"><input id="showPassword" type="checkbox"> <span>Show password</span></label><div class="field"><input id="referral" maxlength="32" value="${esc(state.ref)}" autocomplete="off" placeholder="Referral code (optional)" aria-label="Referral code (optional)"></div><p class="helper">If a friend invited you, enter their code here.</p><div class="field"><input id="phone" inputmode="tel" autocomplete="tel" placeholder="M-Pesa Number" aria-label="M-Pesa Number" required></div>`:''}<button class="btn full" id="authSubmit">${signup?'Create Account':'Login'}</button></form><button class="auth-link" id="authSwitch">${signup?'Already have an account? Login':'Create a new account'}</button>${signup?'<button class="auth-link" id="authBack"> Back</button>':'<button class="auth-link" id="authBack"> Back</button>'}</section></main>`;
 $('#authBack').onclick=renderAuthChoice;
 $('#authSwitch').onclick=()=>renderAuthForm(signup?'login':'signup');
 if(signup)$('#showPassword').onchange=()=>{$('#password').type=$('#showPassword').checked?'text':'password'};
 $('#authForm').onsubmit=async e=>{e.preventDefault();const btn=$('#authSubmit'),err=$('#authError');btn.disabled=true;err.classList.add('hidden');try{const email=$('#email').value.trim(),password=$('#password').value;if(!email||!password)throw Error('Enter your email and password.');if(signup){const username=$('#username').value.trim(),phone=normalizePhone($('#phone').value),referral=$('#referral').value.trim().toUpperCase();if(!/^[A-Za-z0-9_]{3,24}$/.test(username))throw Error('Username must be 3–24 characters using letters, numbers or _ only.');if(password.length<6)throw Error('Password must be at least 6 characters.');if(!phone)throw Error('Enter a valid M-Pesa number.');const d=await req('/functions/v1/signup',{method:'POST',token:KEY,body:{username,email,password,phone,...(referral?{referral}:{})}});if(d.access_token){saveAuth(d);try{await loadProfile()}catch(ex){state.profile=null;console.warn('Profile could not be loaded:',ex)}renderHome();if(!state.profile)toast('Account created. Some account details could not load.')}else{toast(d.message||'Account request submitted. Please sign in when your account is ready.');renderAuthForm('login')}}else{try{await signIn(email,password)}catch(ex){if(/invalid login credentials|invalid email or password|invalid password/i.test(ex.message))throw Error('Invalid email or password');throw ex}}}catch(ex){err.textContent=ex.message;err.classList.remove('hidden')}finally{if($('#authSubmit'))$('#authSubmit').disabled=false}};
}
function normalizePhone(raw){let p=String(raw||'').replace(/[\s()+-]/g,'');if(/^0[17]\d{8}$/.test(p))p='254'+p.slice(1);if(/^7\d{8}$/.test(p)||/^1\d{8}$/.test(p))p='254'+p;return /^254[17]\d{8}$/.test(p)?p:null}
async function navigate(page){if(page!=='activate'){clearInterval(state.activationTagTimer);clearInterval(state.activationWithdrawalTimer)}if(!state.token){renderAuth();return}try{if(!state.profile)await loadProfile();if(page==='chat')renderBots();else if(page==='public')await renderPublicChat();else if(page==='bots')renderBots();else if(page==='wallet')await renderWallet();else if(page==='invite')await renderInvite();else if(page==='account')renderAccount();else if(page==='bot'){if(state.bot)await openBot(state.bot);else renderBots();}else if(page==='activate')renderActivation();else if(page==='waiting')renderWaiting(state.pendingId,state.pendingKind||'activation')}catch(e){toast(e.message)}}
async function renderHome(){return renderBots()}
// navigator.onLine only reports whether the device has a network interface. Verify
// that the authenticated Supabase backend is reachable before booking/opening chats.
async function requireLiveConnection(){
 if(!navigator.onLine){showConnectionBanner();return false}
 if(!state.token||!state.uid){toast('Please sign in before booking or opening chat.');return false}
 let timeoutId;
 try{
  const probe=req('/rest/v1/profiles?id=eq.'+encodeURIComponent(state.uid)+'&select=id&limit=1');
  const result=await Promise.race([probe,new Promise((_,reject)=>{timeoutId=setTimeout(()=>reject(new Error('Connection check timed out')),7000)})]);
  if(!Array.isArray(result)||result.length===0)throw new Error('Account could not be verified');
  hideConnectionBanner();return true;
 }catch(e){showConnectionBanner('ChatMula could not be reached. Check your data or Wi-Fi, then try again.');return false}
 finally{if(timeoutId)clearTimeout(timeoutId)}
}
async function renderPublicChat(){if(!await requireLiveConnection())return;state.page='public';try{if(!state.profile)await loadProfile();const pp=state.profile||{},until=pp.chatbot_until?new Date(pp.chatbot_until):null;if(!pp.has_paid||(until&&until>Date.now())){if(!pp.has_paid){renderHome();showActivationWall();return}toast('Public chat unlocks after your pairing period.');renderHome();return}const rows=await req('/rest/v1/messages?select=*&order=created_at.asc');state.messages=Array.isArray(rows)?rows:[];shell(`<section class="card chat-screen-card"><div class="row between"><div><h2>Public chat</h2><p class="muted small">Keep conversations respectful.</p></div><button class="btn secondary" id="refresh">Refresh</button></div><div class="messages" id="messages">${state.messages.map(m=>`<div class="bubble ${m.sender_id===state.uid?'mine':'theirs'}"><div class="meta">${esc(m.sender_username||'Member')} · ${esc(m.created_at?new Date(m.created_at).toLocaleString(): '')}</div>${esc(m.content||'')}${(m.sender_id===state.uid||state.profile?.is_admin)?`<div><button class="link" data-delete="${Number(m.id)}">Delete</button></div>`:''}</div>`).join('')||'<div class="empty">No messages yet. Start the conversation.</div>'}</div><form class="chatbox" id="sendForm"><input id="messageText" maxlength="2000" placeholder="Write a message…" autocomplete="off" required><button class="btn">Send</button></form></section>`,'chat');$('#refresh').onclick=()=>renderPublicChat();app.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{if(!confirm('Delete this message?'))return;try{await req('/rest/v1/messages?id=eq.'+encodeURIComponent(b.dataset.delete),{method:'DELETE'});await renderPublicChat()}catch(e){toast(e.message)}});$('#sendForm').onsubmit=async e=>{e.preventDefault();const input=$('#messageText'),text=input.value.trim();if(!text)return;const btn=e.submitter;btn.disabled=true;try{await req('/rest/v1/messages',{method:'POST',body:{sender_id:state.uid,sender_username:state.username,content:text},prefer:'return=minimal'});input.value='';await renderPublicChat()}catch(ex){toast(ex.message)}finally{btn.disabled=false}};const box=$('#messages');box.scrollTop=box.scrollHeight}catch(e){shell(`<div class="notice error">${esc(e.message)}</div><button class="btn" id="back">Back</button>`);$('#back').onclick=()=>renderHome()}}

// ================= UPDATED WALLET & WITHDRAWAL LOGIC =================
async function renderWallet(){
  state.page='wallet';
  if(!state.profile) await loadProfile();
  const p=state.profile||{};
  
  // Default to the registered phone number, but allow editing
  const defaultPhone = p.phone || p.phone_number || localStorage.getItem('cm_draft_phone') || '';

  shell(`<section class="hero"><h1>Your wallet</h1><p>Track your earnings and request withdrawals.</p></section>
  <section class="card">
    <p class="muted">Available balance</p>
    <h1>${fmt(p.wallet_balance)}</h1>
    <div class="grid2">
      <div class="stat"><strong>${fmt(p.total_earned)}</strong><span>Total earned</span></div>
      <div class="stat"><strong>${fmt(p.total_withdrawn)}</strong><span>Total withdrawn</span></div>
    </div>
  </section>
  <section class="card">
    <h2>Request withdrawal</h2>
    <p class="muted small">You can change the M-Pesa number below if needed.</p>
    <div id="walletError" class="notice error hidden"></div>
    <form id="withdrawForm">
      <div class="field">
        <label>M-Pesa phone number</label>
        <input id="withdrawPhone" inputmode="tel" value="${esc(defaultPhone)}" placeholder="0712345678" required>
      </div>
      <div class="field">
        <label>Amount (KSh)</label>
        <input id="withdrawAmount" type="number" min="100" max="${Math.max(0,Number(p.wallet_balance||0))}" step="1" required>
      </div>
      <p class="muted small" id="withdrawHint">Minimum withdrawal: KSh 100. Available: ${fmt(p.wallet_balance)}.</p>
      <button class="btn full">Submit withdrawal request</button>
    </form>
    <button class="btn secondary full" id="walletRefresh" style="margin-top:8px">Refresh balance</button>
  </section>`,'wallet');

  $('#walletRefresh').onclick=()=>renderWallet();
  
  $('#withdrawAmount').oninput=()=>{
    const a=Number($('#withdrawAmount').value||0),bal=Number(p.wallet_balance||0),h=$('#withdrawHint');
    if(h) h.textContent=bal<100?'Withdrawals start at KSh 100. Your available balance is '+fmt(bal)+'.':a<100?'Minimum withdrawal is KSh 100.':a>bal?'Insufficient balance. You have '+fmt(bal)+' available.':'You can withdraw this amount.';
  };

  $('#withdrawForm').onsubmit=async e=>{
    e.preventDefault();
    const phone = normalizePhone($('#withdrawPhone').value);
    const amount = Number($('#withdrawAmount').value);
    const err = $('#walletError');
    err.classList.add('hidden');
    
    if(!phone) { err.textContent='Enter a valid M-Pesa phone number.'; err.classList.remove('hidden'); return; }
    if(!Number.isFinite(amount)||amount<100) { err.textContent='Minimum withdrawal is KSh 100.'; err.classList.remove('hidden'); return; }
    const available = Number(state.profile?.wallet_balance||0);
    if(available<100) { err.textContent='Your available balance is below the KSh 100 minimum.'; err.classList.remove('hidden'); return; }
    if(amount>available) { err.textContent='Insufficient wallet balance. Available: '+fmt(available)+'.'; err.classList.remove('hidden'); return; }

    // Store data and trigger the small login modal
    pendingWithdrawalData = { phone, amount };
    openAuthModal();
  }
}

function openAuthModal() {
    const modal = document.getElementById('auth-modal');
    const content = document.getElementById('auth-modal-content');
    document.getElementById('authPassword').value = '';
    document.getElementById('authError').classList.add('hidden');
    
    modal.classList.remove('hide');
    // Small delay for transition
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
    }, 10);
    
    // Focus the password input
    setTimeout(() => document.getElementById('authPassword').focus(), 300);
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    const content = document.getElementById('auth-modal-content');
    modal.classList.add('opacity-0');
    content.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hide');
    }, 300);
    pendingWithdrawalData = null;
}

async function confirmWithdraw() {
    const password = document.getElementById('authPassword').value;
    const err = document.getElementById('authError');
    const btn = document.getElementById('btn-auth-confirm');

    if (!password) {
        err.textContent = "Please enter your password.";
        err.classList.remove('hidden');
        return;
    }

    btn.disabled = true;
    btn.textContent = "Verifying...";
    err.classList.add('hidden');

    try {
        // Generate a unique idempotency key to prevent double-spending
        const idempotencyKey = crypto.randomUUID();

        // Send password to backend for verification and processing
        const result = await req('/functions/v1/withdraw', {
            method:'POST',
            body: { 
                phone: pendingWithdrawalData.phone, 
                amount: pendingWithdrawalData.amount, 
                idempotencyKey: idempotencyKey,
                password: password // Backend MUST verify this password
            }
        });

        toast(result.message || 'Withdrawal request submitted.');
        
        // Save the new phone number as the draft so they don't have to retype it next time
        localStorage.setItem('cm_draft_phone', pendingWithdrawalData.phone);

        closeAuthModal();
        
        // Refresh the wallet to show the deducted balance (assuming backend deducts immediately)
        await renderWallet(); 

    } catch (ex) {
        // If the backend rejects the password, show the error inside the modal
        err.textContent = ex.message || 'Incorrect password.';
        err.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.textContent = "Confirm Withdrawal";
    }
}
// =====================================================================

function renderInvite(){if(!state.profile)await loadProfile();const p=state.profile||{};if(!p.has_paid){renderHome();showActivationWall();return}state.page='invite';let settings=[];try{settings=await req('/rest/v1/site_settings?select=*&id=eq.main', {token:KEY})}catch{}const base=(settings?.[0]?.website_url||'https://chatmula.co.ke').replace(/\/$/,'');const code=p.referral_code||state.ref||'';const link=code?`${base}/?ref=${encodeURIComponent(code)}`:'';shell(`<section class="hero"><h1>Invite your people</h1><p>Share your referral link and invite friends to join ChatMula.</p></section><section class="card"><h2>Your referral code</h2><div class="stat"><strong>${esc(code||'Not available')}</strong><span>Share this code with friends</span></div><div class="field"><label>Your referral link</label><input id="refLink" readonly value="${esc(link)}"></div><div class="grid2"><button class="btn" id="copyLink">Copy link</button><button class="btn secondary" id="shareLink">Share link</button></div><p class="muted small">Referral eligibility and rewards are calculated by the existing backend.</p></section>`,'invite');$('#copyLink').onclick=async()=>{try{await navigator.clipboard.writeText(link);toast('Referral link copied.')}catch{ $('#refLink').select();document.execCommand('copy');toast('Referral link copied.')}};$('#shareLink').onclick=async()=>{if(navigator.share){try{await navigator.share({title:'Join ChatMula',text:'Join me on ChatMula!',url:link})}catch{}}else{try{await navigator.clipboard.writeText(link);toast('Link copied.')}catch{toast(link)}}}}
function renderAccount(){state.page='account';const p=state.profile||{};shell(`<section class="hero"><h1>Account</h1><p>Manage your ChatMula session.</p></section><section class="card"><div class="row"><div class="avatar" style="display:grid;place-items:center;font-size:24px"></div><div class="item-main"><strong>${esc(state.username||'ChatMula member')}</strong><p>${esc(state.email)}</p></div></div><div class="divider"></div><div class="row between"><span class="muted">Activation</span><strong>${p.has_paid?'Active':'Not active'}</strong></div><div class="row between" style="margin-top:12px"><span class="muted">Account role</span><strong>${p.is_admin?'Administrator':'Member'}</strong></div><div class="row between" style="margin-top:12px"><span class="muted">Referral code</span><strong>${esc(p.referral_code||'—')}</strong></div><div class="divider"></div>${!p.has_paid?'<button class="btn full" id="accountActivate">Activate account</button>':''}<button class="btn danger full" id="logout" style="margin-top:8px">Sign out</button></section><p class="muted small">This PWA uses your existing ChatMula account and Supabase backend. Browser push notifications are not included.</p>`,'account');$('#logout').onclick=logout;if($('#accountActivate'))$('#accountActivate').onclick=()=>navigate('activate')}

window.addEventListener('error',function(e){console.error('ChatMula UI error',e.error||e.message);if(app&&!app.querySelector('.fatal-error')){const d=document.createElement('div');d.className='notice error fatal-error';d.style.margin='16px';d.textContent='ChatMula could not display this screen: '+(e.message||'unknown error')+'. Reload the page or contact support if it continues.';app.appendChild(d)}});
function botStoreKey(){return 'cm_bot_state_'+(state.uid||'guest')}
function readBotState(){try{return JSON.parse(localStorage.getItem(botStoreKey())||'{}')}catch{return {}}}
function writeBotState(v){localStorage.setItem(botStoreKey(),JSON.stringify(v))}
function botHistoryKey(bot){return 'cm_bot_'+state.uid+'_'+String(bot[6]||bot[0]).toLowerCase()}
function hasRepliedToAnyBot(){return orderedBots().some(b=>{try{return JSON.parse(localStorage.getItem(botHistoryKey(b))||'[]').some(m=>m.mine)}catch{return false}})}
function botIsEnded(bot){const s=readBotState();return !!(s.ended&&s.ended[String(bot[6]||bot[0]).toLowerCase()])}
function countryWithFlag(country){return country==='USA'?'USA ':country==='Canada'?'Canada ':country==='UK'?'UK ':country}
function renderBots(){
 const bs=readBotState(),booked=bs.bookedName,bookedAt=Number(bs.bookedAt||0),remaining=Math.max(0,30000-(Date.now()-bookedAt));state.page='bots';
 const order=orderedBots(),rows=[];
 if(state.profile?.has_paid)rows.push(`<div class="item public-item" role="button" tabindex="0" id="publicChatRow"><img class="avatar" src="icon.jpg" alt="Chatmula Public"><div class="item-main"><strong>Chatmula Public</strong><p class="preview">Tap to open public chat</p></div></div>`);
 // Keep the original Android per-user bot order and put an ended/replied conversation first.
 let hoist=order.find(b=>botIsEnded(b));if(!hoist)hoist=order.find(b=>{try{return JSON.parse(localStorage.getItem(botHistoryKey(b))||'[]').some(m=>m.mine)}catch{return false}});
 const list=hoist?[hoist,...order.filter(b=>b!==hoist)]:order;
 for(const b of list){
   const key=String(b[6]||b[0]).toLowerCase();let history=[];try{history=JSON.parse(localStorage.getItem(botHistoryKey(b))||'[]')}catch{}
   const replied=history.some(m=>m.mine),ended=botIsEnded(b),visual=(bs.visual||[]).includes(key),isBooked=booked===b[0],wait=isBooked&&remaining>0;
   let label='Book',preview='',buttonClass='';
   if(ended){label='View';preview=' New message';}
   else if(replied){label='Chat';preview='Tap to continue';}
   else if(isBooked){if(wait){label='Booking…';preview='Booking… '+Math.ceil(remaining/1000)+'s';buttonClass='booked'}else{label='Chat';preview='Tap to chat'}}
   else if(visual){label='Booked';preview='Booked — '+(b[6]||b[0].split(' ')[0])+' will reach out';buttonClass='booked'}
   rows.push(`<div class="item"><img class="avatar bot-avatar" data-picture="${esc(b[0])}" src="${esc(b[4])}" alt="${esc(b[0])}" loading="lazy" onerror="this.onerror=null;this.src='icon.jpg';this.alt='ChatMula'"><div class="item-main"><strong>${esc(b[0])}</strong><p class="rate">$5 per 20 min ·  ${esc(b[3])}</p><p class="level">${esc(b[7]||'Swahili beginner')}</p><p class="country">${esc(countryWithFlag(b[2]))}</p>${preview?`<p class="preview ${ended?'new-message':''}">${esc(preview)}</p>`:''}</div><button class="book-btn ${buttonClass}" data-bot="${esc(b[0])}" ${wait?'disabled':''}>${label}</button></div>`);
 }
 shell(`<section class="chat-list">${rows.join('')}</section>`,'bots');
 const publicRow=$('#publicChatRow');if(publicRow){publicRow.onclick=()=>navigate('public');publicRow.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();navigate('public')}}}
 app.querySelectorAll('[data-bot]').forEach(btn=>btn.onclick=()=>handleBotTap(bots.find(b=>b[0]===btn.dataset.bot)));
 app.querySelectorAll('[data-picture]').forEach(img=>img.onclick=()=>showBotPicture(img.dataset.picture));
 if(remaining>0){clearTimeout(state.botReplyTimer);state.botReplyTimer=setTimeout(()=>{if(state.page==='bots')renderBots()},1000)}
}
function showBotPicture(name){const bot=bots.find(b=>b[0]===name);if(!bot)return;const layer=document.createElement('div');layer.className='picture-overlay';layer.innerHTML=`<div class="picture-dialog"><h3>${esc(bot[0])}</h3><img src="${esc(bot[4])}" alt="${esc(bot[0])}"><button class="btn full" id="closePicture">Close</button></div>`;document.body.appendChild(layer);$('#closePicture').onclick=()=>layer.remove();layer.onclick=e=>{if(e.target===layer)layer.remove()}}
async function handleBotTap(bot){
 if(!bot)return;
 // Block every booking/chat entry until the real backend responds, even when the
 // browser says it is online but the connection has no internet access.
 if(!await requireLiveConnection())return;
 const key=String(bot[6]||bot[0]).toLowerCase(),bs=readBotState();let hist=[];try{hist=JSON.parse(localStorage.getItem(botHistoryKey(bot))||'[]')}catch{}
 const ended=botIsEnded(bot),replied=hist.some(m=>m.mine);
 if(ended){if(!state.profile?.has_paid){showActivationWall();return}openBot(bot,true);return}
 if(replied){openBot(bot,true);return}
 if(bs.bookedName===bot[0]){const rem=Math.max(0,30000-(Date.now()-Number(bs.bookedAt||0)));if(rem>0){renderBots();return}openBot(bot,true);return}
 if(!hasRepliedToAnyBot()){
   // Native MessagesActivity allows the initial 30-second booking to be moved to the tapped bot.
   bs.bookedName=bot[0];bs.bookedAt=Date.now();writeBotState(bs);toast((bot[6]||bot[0].split(' ')[0])+' is joining... 30s');renderBots();return;
 }
 if(!navigator.onLine){toast('Internet connection required to book another chatbot.');return}
 if(!state.profile?.has_paid){showActivationWall();return}
 bs.visual=Array.isArray(bs.visual)?bs.visual:[];if(bs.visual.includes(key)){toast((bot[6]||bot[0])+' will reach out soon');return}bs.visual.push(key);writeBotState(bs);toast('Booked — '+(bot[6]||bot[0])+' will reach out');renderBots();
}
async function openBot(bot,connectionChecked=false){if(!bot)return;if(!connectionChecked&&!await requireLiveConnection())return;state.bot=bot;try{state.botHistory=JSON.parse(localStorage.getItem(botHistoryKey(bot))||'[]')}catch{state.botHistory=[]}state.botTyping=false;renderBotChat();if(!state.botHistory.length){state.botTyping=true;renderBotChat();const delay=2500+Math.floor(Math.random()*1500);clearTimeout(state.botReplyTimer);state.botReplyTimer=setTimeout(()=>{if(state.page!=='bot')return;state.botTyping=false;state.botHistory.push({mine:false,text:'Hey '});saveBotHistory();renderBotChat()},delay)}}
function saveBotHistory(){if(state.bot&&state.uid)localStorage.setItem(botHistoryKey(state.bot),JSON.stringify(state.botHistory||[]))}
function renderBotChat(){
 if(!state.bot){renderBots();return}state.page='bot';const bot=state.bot,history=state.botHistory||[],ended=botIsEnded(bot);
 shell(`<section class="card chat-screen-card"><div class="row"><img class="avatar" src="./${bot[4]}" alt="${esc(bot[0])}" onerror="this.onerror=null;this.src='./icon.jpg';this.alt='ChatMula bot'"><div class="item-main"><strong>${esc(bot[0])}</strong><p>$5 per 20 min ·  ${bot[3]} · ${esc(bot[7]||'Swahili beginner')} · ${esc(countryWithFlag(bot[2]))}</p></div><button class="btn secondary" id="backBots">Back</button></div><div class="messages" id="botMessages">${history.map(m=>`<div class="bubble ${m.mine?'mine':'theirs'}">${esc(m.text)}</div>`).join('')}${state.botTyping?`<div class="typing" id="botTyping">${esc(bot[6]||bot[0].split(' ')[0])} is typing…</div>`:''}</div>${ended?`<div class="notice">Wait for ${esc(bot[6]||bot[0].split(' ')[0])} to resume chat.</div>`:''}<form class="chatbox" id="botForm"><input id="botText" maxlength="1200" placeholder="${ended?'Conversation paused':'Message '+esc(bot[6]||bot[0].split(' ')[0])+'…'}" ${ended||state.botTyping?'disabled':''} required><button class="btn" ${ended||state.botTyping?'disabled':''}>Send</button></form></section>`,'bot');
 $('#backBots').onclick=()=>{clearTimeout(state.botReplyTimer);state.botTyping=false;renderBots()};const box=$('#botMessages');box.scrollTop=box.scrollHeight;
 $('#botForm').onsubmit=e=>{
  e.preventDefault();const input=$('#botText'),text=input.value.trim();if(!text||state.botTyping||botIsEnded(bot))return;
  state.botHistory.push({mine:true,text});saveBotHistory();const turns=state.botHistory.filter(m=>m.mine).length;
  state.botTyping=true;renderBotChat();const reply=botReplyFor(turns,bot[6]||bot[0].split(' ')[0]);
  const base=turns===1?6000:turns===2?8000:turns===3?9000:turns===4?8000:3500;
  const spread=turns===1?4000:turns===2||turns===3?4500:turns===4?4000:1500;
  const delay=base+Math.floor(Math.random()*(spread+1))+Math.min(2500,text.length*25);
  state.botReplyTimer=setTimeout(()=>{if(state.page!=='bot'||!state.bot)return;state.botTyping=false;state.botHistory.push({mine:false,text:reply});if(turns>=5){const bs=readBotState();bs.ended=bs.ended||{};bs.ended[String(bot[6]||bot[0]).toLowerCase()]=true;writeBotState(bs)}saveBotHistory();renderBotChat()},delay);
 };
}
function botReplyFor(turn,name){
 if(turn>=5){const waves=[' Later!',' See you later!','Alright, later  ',' Talk later!'];return waves[Math.floor(Math.random()*waves.length)]}
 if(turn===4){const byes=["Sorry, I have to step away for a bit — I'm working on a project  I'll be back soon, okay?","I'm in the middle of a project right now  I'll be back soon. Don't go too far!","Something came up with a project I'm working on. I'll be back soon  Talk in a bit!"];return byes[Math.floor(Math.random()*byes.length)]}
 if(turn===1){const intros=[`I'm ${name}  I want to learn Swahili and I'd like you to be my Swahili teacher. Can you help me?`,`I'm ${name}  I've been wanting to learn Swahili properly, and I'd love for you to be my teacher. Would you?`,`I'm ${name}  I'm looking for someone to teach me Swahili. I'd like that person to be you — if you don't mind.`];return intros[Math.floor(Math.random()*intros.length)]}
 const pool=["So where should we start? What's the first thing you'd teach me?","Is 'jambo' too formal for everyday use, or is it fine?","What's a Swahili phrase that would actually impress someone?","What mistakes do learners usually make that I should avoid?","How do I pronounce Swahili words naturally without sounding like a textbook?","What's a Swahili phrase people actually use every day, not just in lessons?","Is there a Swahili phrase that always makes people smile?","What's one thing about Swahili that surprises most learners?"];
 // Stable per-bot shuffle, then select the same turn position as the Android script.
 let seed=0;for(const ch of String(name))seed=(seed*31+ch.charCodeAt(0))|0;const shuffled=pool.slice();for(let i=shuffled.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)|0;const j=(seed>>>0)%(i+1);[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]]}return shuffled[Math.max(0,Math.min(shuffled.length-1,turn-2) )];
}
async function renderActivation(){
 state.page='activate';let settings=[];try{settings=await req('/rest/v1/site_settings?select=*&id=eq.main',{token:KEY})}catch{}
 const fee=Number(settings?.[0]?.activation_fee||100),profile=state.profile||{};
 const username=profile.username||state.username||'—',email=profile.email||state.email||'—';
 const savedPhone=profile.phone||profile.phone_number||localStorage.getItem('cm_draft_phone')||'';
 const withdrawals=[
  ['James Maina  ·  07***541  ·  KSh 1,250','#00E5FF','#102A43'],['Amina Wanjiru  ·  07***284  ·  KSh 780','#FFFFFF','#6A1B9A'],['Brian Otieno  ·  07***693  ·  KSh 1,850','#FFF176','#4E342E'],['Faith Njeri  ·  07***175  ·  KSh 640','#B9F6CA','#1B5E20'],['Kevin Kiptoo  ·  07***826  ·  KSh 1,100','#FFCCBC','#880E4F'],['Mary Atieno  ·  07***430  ·  KSh 950','#D1C4E9','#283593'],['Daniel Mwangi  ·  07***918  ·  KSh 1,600','#00E5FF','#102A43'],['Grace Chebet  ·  07***362  ·  KSh 720','#FFFFFF','#6A1B9A'],['Samuel Kamau  ·  07***704  ·  KSh 2,000','#FFF176','#4E342E'],['Mercy Achieng  ·  07***251  ·  KSh 680','#B9F6CA','#1B5E20'],['Peter Mutua  ·  07***687  ·  KSh 1,400','#FFCCBC','#880E4F'],['Esther Wambui  ·  07***143  ·  KSh 890','#D1C4E9','#283593'],['Joseph Ouma  ·  07***592  ·  KSh 1,150','#00E5FF','#102A43'],['Lydia Jepkoech  ·  07***318  ·  KSh 610','#FFFFFF','#6A1B9A'],['Dennis Kariuki  ·  07***465  ·  KSh 1,750','#FFF176','#4E342E'],['Joyce Muthoni  ·  07***837  ·  KSh 830','#B9F6CA','#1B5E20']
 ];
 const taglines=['Teach foreigners Swahili and earn','Earn KSh 500+ per conversation','Turn your Swahili into real income','Chat with learners worldwide','Get paid for what you already know'];
 app.innerHTML=`<main class="native-activation">
  <div class="na-hero"><span class="na-live"> LIVE</span><h1 class="na-title">Activate your ChatMula account</h1><p class="na-tagline" id="naTagline">Teach foreigners Swahili and earn</p></div>
  <div class="na-card"><span class="na-label">One-time activation fee</span><div class="na-fee" id="naFee">KSh ${fee.toFixed(2)}</div></div>
  <div class="na-card"><p class="na-account">Username: ${esc(username)}</p><p class="na-email">Email: ${esc(email)}</p><div class="na-field"><label class="na-label" for="activationPhone">M-Pesa number</label><input class="na-input" id="activationPhone" inputmode="tel" autocomplete="tel" placeholder="07XX XXX XXX" value="${esc(savedPhone)}"></div></div>
  <div class="na-card"><span class="na-label">Recent withdrawals</span><div class="na-withdraw" id="naWithdrawal">${withdrawals[0][0]}</div></div>
  <div id="activationError" class="na-error hidden" role="alert"></div>
  <button class="na-pay" id="activationPay">Pay with M-Pesa</button><button class="na-cancel" id="activationBack">Cancel</button>
 </main>`;
 let ti=0,wi=0;clearInterval(state.activationTagTimer);clearInterval(state.activationWithdrawalTimer);
 state.activationTagTimer=setInterval(()=>{const el=$('#naTagline');if(!el||state.page!=='activate'){clearInterval(state.activationTagTimer);return}el.style.opacity='0';el.style.transform='translateY(-8px)';setTimeout(()=>{if(!el||state.page!=='activate')return;ti=(ti+1)%taglines.length;el.textContent=taglines[ti];el.style.transform='translateY(0)';el.style.opacity='1'},280)},2400);
 state.activationWithdrawalTimer=setInterval(()=>{const el=$('#naWithdrawal');if(!el||state.page!=='activate'){clearInterval(state.activationWithdrawalTimer);return}el.style.opacity='0';setTimeout(()=>{if(!el||state.page!=='activate')return;wi=(wi+1)%withdrawals.length;el.textContent=withdrawals[wi][0];el.style.color=withdrawals[wi][1];el.style.background=withdrawals[wi][2];el.style.opacity='1'},220)},2600);
 $('#activationBack').onclick=()=>{clearInterval(state.activationTagTimer);clearInterval(state.activationWithdrawalTimer);renderHome()};
 $('#activationPay').onclick=async()=>{const phone=normalizePhone($('#activationPhone').value),btn=$('#activationPay'),err=$('#activationError');if(!phone){err.textContent='Enter a valid M-Pesa number, e.g. 0712345678.';err.classList.remove('hidden');return}if(!state.token){err.textContent='Your session expired. Please log in again.';err.classList.remove('hidden');return}btn.disabled=true;btn.textContent='Sending prompt…';err.classList.add('hidden');localStorage.setItem('cm_draft_phone',$('#activationPhone').value.trim());try{const d=await req('/functions/v1/activate',{method:'POST',body:{phone}});if(d.alreadyActivated){await loadProfile();toast('Your account is already activated!');renderHome();return}if(!d.pendingId)throw Error(d.message||d.error||'No pending ID from server. Try again.');state.pendingId=d.pendingId;state.pendingKind='activation';clearInterval(state.activationTagTimer);clearInterval(state.activationWithdrawalTimer);renderWaiting(d.pendingId,'activation',Number(d.activationFee||fee))}catch(ex){err.textContent=ex.message||'Payment could not be started. Try again.';err.classList.remove('hidden')}finally{if($('#activationPay')){btn.disabled=false;btn.textContent='Pay with M-Pesa'}}};
}
function renderWaiting(id,kind,fee=100){
 state.page='waiting';clearTimeout(state.pollTimer);app.innerHTML=`<main class="native-activation na-wait"><div class="na-wait-inner"><div class="na-spinner" aria-label="Loading"></div><div class="na-wait-title">Waiting for M-Pesa...</div><div class="na-wait-msg"> Check your phone and enter your\nM-Pesa PIN to complete KSh ${Number(fee||100).toFixed(2)} activation</div><div id="waitingError" class="na-error hidden" role="status"></div></div></main>`;
 let tries=0;const check=async()=>{if(state.page!=='waiting')return;try{if(!navigator.onLine){const e=$('#waitingError');if(e){e.textContent='No internet. Your activation is still pending.';e.classList.remove('hidden')}state.pollTimer=setTimeout(check,5000);return}const path=kind==='activation'?'/functions/v1/check-activation?id=':'/functions/v1/check-signup?id=';const d=await req(path+encodeURIComponent(id),{token:KEY});const status=String(d.status||'').toUpperCase();if(status==='COMPLETED'){clearTimeout(state.pollTimer);const e=$('#waitingError');if(e){e.textContent='Payment confirmed. Updating your account…';e.classList.remove('hidden');e.style.background='#123326';e.style.color='#6EE7B7'}await loadProfile();toast('Payment confirmed.');renderHome();return}if(status==='FAILED'){clearTimeout(state.pollTimer);const e=$('#waitingError');if(e){e.textContent='Payment was not completed. Please try again.';e.classList.remove('hidden')}state.pollTimer=setTimeout(()=>{if(state.page==='waiting')renderHome()},2500);return}tries++;if(tries%6===0){const e=$('#waitingError');if(e){e.textContent='Verifying your payment… keep this screen open.';e.classList.remove('hidden')}}}catch(ex){const e=$('#waitingError');if(e){e.textContent=ex.message||'Unable to verify payment yet. Retrying…';e.classList.remove('hidden')}}state.pollTimer=setTimeout(check,5000)};check();
}

/* V15 native interaction layer: Android-like ripple/haptics and connection feedback. */
(function installNativeInteractionLayer(){
  if(window.__chatmulaNativeLayerInstalled)return;window.__chatmulaNativeLayerInstalled=true;
  const canVibrate=()=>!!(navigator.vibrate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  document.addEventListener('pointerdown',function(ev){
    const target=ev.target&&ev.target.closest&&ev.target.closest('button,.btn,.book-btn,.nav button,.item,[role="button"]');
    if(!target||target.disabled||target.getAttribute('aria-disabled')==='true')return;
    if(canVibrate() && ev.pointerType==='touch') { try{navigator.vibrate(8)}catch(_){ } }
    if(ev.pointerType==='touch' && target.matches('button,.btn,.book-btn,.nav button,[role="button"]')){
      const rect=target.getBoundingClientRect();const size=Math.max(rect.width,rect.height)*1.65;
      const ripple=document.createElement('span');ripple.className='ripple';ripple.style.width=size+'px';ripple.style.height=size+'px';
      ripple.style.left=(ev.clientX-rect.left-size/2)+'px';ripple.style.top=(ev.clientY-rect.top-size/2)+'px';
      target.querySelectorAll(':scope > .ripple').forEach(n=>n.remove());target.appendChild(ripple);
      ripple.addEventListener('animationend',()=>ripple.remove(),{once:true});
    }
  },{passive:true});
  window.addEventListener('offline',()=>showConnectionBanner());
  window.addEventListener('online',()=>showConnectionBanner('Internet is back. ChatMula will check the connection when you try to chat.',true));
  if(!navigator.onLine)showConnectionBanner();
  const syncVisibleHeight=()=>{
    const vv=window.visualViewport;const h=vv?vv.height:window.innerHeight;
    document.documentElement.style.setProperty('--visible-height',Math.max(240,h)+'px');
    const active=document.activeElement;
    if(active&&/INPUT|TEXTAREA/.test(active.tagName)){
      const card=active.closest('.chat-screen-card');const list=card&&card.querySelector('.messages');
      requestAnimationFrame(()=>{try{active.scrollIntoView({block:'nearest',behavior:'auto'});if(list)list.scrollTop=list.scrollHeight}catch(_){}});
    }
  };
  if(window.visualViewport){window.visualViewport.addEventListener('resize',syncVisibleHeight);window.visualViewport.addEventListener('scroll',syncVisibleHeight)}
  window.addEventListener('resize',syncVisibleHeight);window.addEventListener('orientationchange',()=>setTimeout(syncVisibleHeight,250));
  document.addEventListener('focusin',e=>{if(e.target&&/INPUT|TEXTAREA/.test(e.target.tagName))setTimeout(syncVisibleHeight,120)});
  document.addEventListener('focusout',()=>setTimeout(syncVisibleHeight,180));syncVisibleHeight();
})();

/* =============== PLAY STORE & PWA BOOT LOGIC =============== */
const playStoreGate = document.getElementById('play-store-gate');
const appContent = document.getElementById('app-content');
const splashScreen = document.getElementById('splash-screen');

let fakeInterval = null;
let deferredPrompt = null;
let waitingForPrompt = false;

const _ua = navigator.userAgent || '';
const _isAndroid = /Android/i.test(_ua);
const _isIOS = /iPhone|iPad|iPod/i.test(_ua);
const _isChromeBrowser = /Chrome\/\d+/i.test(_ua) && !/Edg|OPR|SamsungBrowser|Firefox/i.test(_ua);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
const _cameFromIntent = new URLSearchParams(location.search).get('_pwa') === '1' || new URLSearchParams(location.search).get('source') === 'pwa';
const _wasInstalled = localStorage.getItem('pwa_installed') === '1';

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (waitingForPrompt) {
        waitingForPrompt = false;
        triggerRealInstall();
    }
});

window.addEventListener('appinstalled', () => {
    localStorage.setItem('pwa_installed', '1');
    clearInterval(fakeInterval);
    showInstalledState();
});

function showInstallState(){
    document.getElementById('pre-install-buttons').classList.remove('hide');
    document.getElementById('downloading-buttons').classList.add('hide');
    document.getElementById('post-install-buttons').classList.add('hide');
    document.getElementById('download-text').classList.add('hide');
    document.getElementById('ring-svg').classList.add('hidden');
    document.getElementById('stats-row').classList.remove('hide');
    document.getElementById('post-install-content').classList.add('hide');
    document.getElementById('pre-install-content').classList.remove('hide');
    updateProgressUI(0); 
}

function showInstalledState(){
    document.getElementById('pre-install-buttons').classList.add('hide');
    document.getElementById('downloading-buttons').classList.add('hide');
    document.getElementById('post-install-buttons').classList.remove('hide');
    document.getElementById('download-text').classList.add('hide');
    document.getElementById('ring-svg').classList.add('hidden');
    document.getElementById('stats-row').classList.add('hide');
    document.getElementById('post-install-content').classList.remove('hide');
    document.getElementById('pre-install-content').classList.remove('hide');
}

function mockUninstall(){
    localStorage.removeItem('pwa_installed');
    showInstallState();
}

function setRating(r){
    document.querySelectorAll('.rate-star').forEach((s,i)=>{
        if(i<r){ s.classList.remove('text-gray-300'); s.classList.add('text-yellow-400'); s.setAttribute('fill','currentColor'); }
        else { s.classList.remove('text-yellow-400'); s.classList.add('text-gray-300'); s.setAttribute('fill','none'); }
    });
    if(r>0){ const b = document.getElementById('btn-write-review'); b.innerText = `Thanks for rating ${r} stars!`; b.classList.remove('text-[#0056D2]'); b.classList.add('text-green-600'); }
}

function toggleReviews() {
    const extra = document.getElementById('more-reviews');
    const btn = document.getElementById('btn-see-all');
    if (extra.classList.contains('hide')) {
        extra.classList.remove('hide');
        btn.innerText = "Show less";
    } else {
        extra.classList.add('hide');
        btn.innerText = "See all 15,204 reviews";
    }
}

document.getElementById('btn-store-install').addEventListener('click', () => {
    startFakeDownload();
    if (deferredPrompt) {
        triggerRealInstall();
    } else {
        waitingForPrompt = true;
    }
});

function triggerRealInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            // appinstalled event will handle the UI change
        }
        deferredPrompt = null;
        if (localStorage.getItem('pwa_installed') !== '1') {
            showInstallState();
        }
    });
}

function startFakeDownload() {
    document.getElementById('pre-install-buttons').classList.add('hide');
    document.getElementById('downloading-buttons').classList.remove('hide');
    document.getElementById('download-text').classList.remove('hide');
    document.getElementById('ring-svg').classList.remove('hidden');

    const startTime = Date.now();
    const duration = 30000; // 30 seconds

    clearInterval(fakeInterval);
    fakeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100); 
        updateProgressUI(progress);

        if (elapsed >= duration) {
            clearInterval(fakeInterval);
            document.getElementById('download-text').classList.add('hide');
            
            // Force the UI to show "Installed" even if Chrome didn't prompt
            if (localStorage.getItem('pwa_installed') !== '1') {
                showInstallState();
            } else {
                showInstalledState();
            }
        }
    }, 50);
}

function updateProgressUI(progress) {
    const ring = document.getElementById('download-ring');
    const pct = document.getElementById('download-percent');
    if(ring) ring.style.strokeDashoffset = 301.59 - (progress / 100) * 301.59;
    if(pct) pct.innerText = Math.floor(progress) + "% of 10 MB";
}

// Open button - Shows the "App is installed" prompt (ZambiaCash style)
document.getElementById('btn-open-app').addEventListener('click', () => {
    const promoText = document.getElementById('installed-promo-text');
    
    // If the user arrived via a referral link, show their actual code
    if (state.ref) {
        promoText.innerText = `Your referral code: ${state.ref}`;
    } else {
        promoText.innerText = `Use promo code: CHAT2026`;
    }

    const prompt = document.getElementById('installed-prompt');
    prompt.classList.remove('hide');
    
    // Slide it down smoothly
    setTimeout(() => {
        prompt.classList.remove('opacity-0', '-translate-y-2');
        prompt.classList.add('opacity-100', 'translate-y-0');
    }, 10);

    // Auto-hide after 8 seconds
    setTimeout(() => {
        prompt.classList.remove('opacity-100', 'translate-y-0');
        prompt.classList.add('opacity-0', '-translate-y-2');
        setTimeout(() => {
            prompt.classList.add('hide');
        }, 300);
    }, 8000);
});

// Register Service Worker immediately on load (Required for Install Prompt)
if('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(e => console.warn('Service worker unavailable:', e));
    });
}

// Exact boot sequence matching ZambiaCash
if (isStandalone) {
    playStoreGate.classList.add('hide');
    appContent.classList.remove('hide');
    proceedToAppBoot();
} else if (_cameFromIntent) {
    playStoreGate.classList.add('hide');
    showAppInline();
} else if (_wasInstalled) {
    playStoreGate.classList.add('hide');
    appContent.classList.remove('hide');
    proceedToAppBoot();
} else {
    playStoreGate.classList.remove('hide');
    showInstallState();
}

async function proceedToAppBoot(){
    if(_cameFromIntent) history.replaceState({}, '', window.location.pathname);
    
    // Ensure URL referrer overrides localStorage if it exists on initial load
    if(new URLSearchParams(location.search).get('ref')){
        state.ref=new URLSearchParams(location.search).get('ref').trim().toUpperCase();
        localStorage.setItem('cm_ref',state.ref);
    }
    
    if(state.token&&state.uid){
        try{await loadProfile()}catch(e){state.profile=null;console.warn('Profile refresh failed; keeping signed-in session:',e)}
        renderHome();
        if(!state.profile)toast('Chatbots are shown, but account details could not load.');
        return
    }
    renderAuth()
}

// GitHub Pages project URLs sometimes open without the final slash.
const lastPathPart=location.pathname.split('/').pop();
if(location.protocol.startsWith('http') && location.pathname!=='/' && !location.pathname.endsWith('/') && !lastPathPart.includes('.')) {
  location.replace(location.pathname+'/'+location.search+location.hash);
}