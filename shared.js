/**
 * Stagewell AI - Shared Components
 * Common functionality across all pages
 */

// ===========================================
// SUPABASE CLIENT
// ===========================================
const SUPABASE_URL = 'https://dvdiokmsdhgfcgagvaxd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_NBGt8ntEBwHn6tyuJgzfMg_Bmvj6z2f';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===========================================
// THEME CONFIGURATION
// ===========================================
const THEMES = [
    { id: 'default', name: 'Stagewell', emoji: '💜', gradient: ['#6366f1', '#8b5cf6'] },
    { id: 'ocean', name: 'Ocean', emoji: '🌊', gradient: ['#0ea5e9', '#06b6d4'] },
    { id: 'forest', name: 'Forest', emoji: '🌲', gradient: ['#059669', '#10b981'] },
    { id: 'sunset', name: 'Sunset', emoji: '🌅', gradient: ['#f97316', '#fb923c'] },
    { id: 'rose', name: 'Rose', emoji: '🌸', gradient: ['#e11d48', '#f43f5e'] },
    { id: 'midnight', name: 'Midnight', emoji: '🌙', gradient: ['#4338ca', '#6366f1'] }
];

// ===========================================
// SIDEBAR HTML GENERATOR
// ===========================================
function generateSidebar(activePage) {
    // Navigation structure - focused on CRUD/data viewing (interactive tools are app-only)
    const pages = [
        { id: 'home', href: 'home.html', icon: '🏠', label: 'Home', description: 'Dashboard & habits' },
        { id: 'journal', href: 'journal.html', icon: '📓', label: 'Journal', badge: 'View', badgeStyle: 'muted', description: 'View entries' },
        { id: 'progress', href: 'progress.html', icon: '📈', label: 'Progress', description: 'XP & achievements' },
        { id: 'settings', href: 'settings.html', icon: '⚙️', label: 'Settings', description: 'Preferences' }
    ];

    return `
        <aside class="w-full lg:w-72 sidebar-glass flex-shrink-0 lg:min-h-screen">
            <div class="p-6">
                <a href="home.html" class="block">
                    <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-primary">
                        Stagewell
                    </h2>
                    <p class="text-xs mt-1 uppercase tracking-wider" style="color: var(--text-muted);">Wellness Dashboard</p>
                </a>
            </div>
            <nav class="px-4 pb-4 lg:pb-0 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible scrollbar-hide">
                ${pages.map(page => {
                    const isActive = page.id === activePage;
                    let badgeHtml = '';
                    if (page.badge) {
                        if (page.badgeStyle === 'muted') {
                            badgeHtml = `<span class="hidden lg:inline ml-auto text-xs px-2 py-0.5 rounded-full" style="background: var(--bg-muted); color: var(--text-muted);">${page.badge}</span>`;
                        } else {
                            badgeHtml = `<span class="hidden lg:inline ml-auto badge-primary text-xs">${page.badge}</span>`;
                        }
                    }
                    return `
                        <a href="${page.href}" class="sidebar-item ${isActive ? 'active' : ''} flex-shrink-0 flex items-center gap-3">
                            <span class="text-xl">${page.icon}</span>
                            <span class="hidden lg:inline">${page.label}</span>
                            ${badgeHtml}
                        </a>
                    `;
                }).join('')}
            </nav>
            <div class="hidden lg:block p-4 mt-auto" style="border-top: 1px solid var(--border-default);" x-show="userEmail">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-lg">
                        <span x-text="userEmail ? userEmail[0].toUpperCase() : 'U'"></span>
                    </div>
                    <div class="overflow-hidden flex-1">
                        <p class="text-sm font-medium truncate" style="color: var(--text-primary);" x-text="userEmail"></p>
                        <button @click="signOut" class="text-xs text-red-500 hover:underline">Sign Out</button>
                    </div>
                </div>
            </div>
        </aside>
    `;
}

// ===========================================
// HEADER HTML GENERATOR
// ===========================================
function generateHeader(title, subtitle) {
    return `
        <div class="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
            <div class="animate-fade-in">
                <p class="text-sm font-medium mb-1" style="color: var(--text-muted);" x-text="currentDateFormatted"></p>
                <h1 class="text-2xl md:text-3xl font-bold" style="color: var(--text-primary);">${title}</h1>
                <p class="mt-1" style="color: var(--text-secondary);">${subtitle}</p>
            </div>
            <div class="flex items-center gap-3 flex-wrap">
                <!-- Sync Status -->
                <div class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                     style="background: rgba(20, 184, 166, 0.1); color: rgb(13, 148, 136);">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style="background: var(--color-accent-500);"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2" style="background: var(--color-accent-500);"></span>
                    </span>
                    Synced
                </div>
                <!-- Dark Mode Toggle -->
                <button @click="toggleDarkMode" class="btn-ghost flex items-center gap-2" :title="darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
                    <span x-show="!darkMode" class="text-xl">🌙</span>
                    <span x-show="darkMode" class="text-xl">☀️</span>
                </button>
                <!-- Theme Picker -->
                <div class="relative" x-data="{ open: false }">
                    <button @click="open = !open" class="btn-ghost flex items-center gap-2 px-3 py-2 rounded-lg" style="background: var(--bg-muted);">
                        <span x-text="themeEmoji" class="text-lg"></span>
                        <span class="hidden sm:inline text-sm font-medium" style="color: var(--text-secondary);" x-text="themeName"></span>
                        <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': open }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                    <div x-show="open" @click.away="open = false" x-transition
                         class="theme-picker-dropdown animate-fade-in">
                        <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color: var(--text-muted);">Color Theme</p>
                        <div class="space-y-1">
                            <template x-for="t in themes" :key="t.id">
                                <button @click="setTheme(t.id); open = false"
                                        class="theme-option w-full"
                                        :class="{ 'active': currentTheme === t.id }">
                                    <div class="theme-swatch" :style="'background: linear-gradient(135deg, ' + t.gradient[0] + ', ' + t.gradient[1] + ')'">
                                        <span x-text="t.emoji" class="drop-shadow"></span>
                                    </div>
                                    <div class="flex-1 text-left">
                                        <p class="font-medium text-sm" style="color: var(--text-primary);" x-text="t.name"></p>
                                    </div>
                                    <svg x-show="currentTheme === t.id" class="w-5 h-5" style="color: var(--color-primary-500);" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                    </svg>
                                </button>
                            </template>
                        </div>
                    </div>
                </div>
                <!-- Mobile Sign Out -->
                <button @click="signOut" class="lg:hidden btn-ghost" style="color: var(--text-muted);">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// ===========================================
// AUTH SCREEN HTML GENERATOR
// ===========================================
function generateAuthScreen(pageTitle) {
    return `
        <div x-show="!session" class="min-h-screen flex items-center justify-center p-4">
            <div class="max-w-md w-full card-glass overflow-hidden animate-fade-in">
                <div class="bg-gradient-primary p-8 text-center relative overflow-hidden">
                    <div class="absolute inset-0 overflow-hidden">
                        <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    </div>
                    <div class="relative">
                        <h1 class="text-3xl font-bold text-white mb-2">Stagewell AI</h1>
                        <p class="text-white/80">${pageTitle}</p>
                    </div>
                </div>
                <div class="p-8" style="background: var(--bg-surface);">
                    <p class="text-center mb-6" style="color: var(--text-secondary);">Sign in to access your ${pageTitle.toLowerCase()}.</p>
                    <div x-show="!emailSent">
                        <button @click="signInWithGoogle"
                                :disabled="loading"
                                class="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md disabled:opacity-50"
                                style="background: white; border: 1px solid #e5e7eb; color: #374151;">
                            <svg class="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span>Continue with Google</span>
                        </button>
                        <div class="flex items-center gap-4 my-6">
                            <div class="flex-1 h-px" style="background: var(--border-default);"></div>
                            <span class="text-xs font-medium" style="color: var(--text-muted);">or sign in with email</span>
                            <div class="flex-1 h-px" style="background: var(--border-default);"></div>
                        </div>
                        <form @submit.prevent="signInWithMagicLink" class="space-y-4">
                            <input type="email" x-model="loginEmail" required
                                   class="input-themed w-full"
                                   placeholder="Enter your email">
                            <button type="submit" :disabled="loading"
                                    class="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50">
                                <span x-show="!loading">✨ Send Magic Link</span>
                                <span x-show="loading" class="flex items-center gap-2">
                                    <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Sending...
                                </span>
                            </button>
                        </form>
                    </div>
                    <div x-show="emailSent" x-cloak class="text-center">
                        <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl" style="background: var(--bg-muted);">✉️</div>
                        <h3 class="text-lg font-bold mb-2" style="color: var(--text-primary);">Check your email</h3>
                        <p class="text-sm mb-6" style="color: var(--text-secondary);">We sent a magic link to <strong x-text="loginEmail"></strong>.</p>
                        <button @click="emailSent = false" class="font-medium hover:underline text-sm" style="color: var(--color-primary-500);">Try a different email</button>
                    </div>
                </div>
                <p class="text-xs text-center py-4" style="color: var(--text-muted); background: var(--bg-surface);">
                    Securely connected via Supabase Auth
                </p>
            </div>
        </div>
    `;
}

// ===========================================
// SHARED ALPINE.JS DATA MIXIN
// ===========================================
function sharedPageData(pageName) {
    return {
        // Auth state
        session: null,
        userEmail: '',
        loading: false,
        loginEmail: '',
        emailSent: false,

        // Theme state
        darkMode: localStorage.getItem('stagewell-mode') === 'dark',
        currentTheme: localStorage.getItem('stagewell-theme') || 'default',
        themes: THEMES,

        // Computed
        get userFirstName() {
            if (!this.userEmail) return 'there';
            const name = this.userEmail.split('@')[0];
            return name.charAt(0).toUpperCase() + name.slice(1);
        },

        get themeEmoji() {
            const theme = this.themes.find(t => t.id === this.currentTheme);
            return theme ? theme.emoji : '💜';
        },

        get themeName() {
            const theme = this.themes.find(t => t.id === this.currentTheme);
            return theme ? theme.name : 'Stagewell';
        },

        get currentDateFormatted() {
            return new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            });
        },

        get greeting() {
            const hour = new Date().getHours();
            if (hour < 12) return 'Good morning';
            if (hour < 17) return 'Good afternoon';
            return 'Good evening';
        },

        // Theme methods
        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            const mode = this.darkMode ? 'dark' : 'light';
            document.documentElement.setAttribute('data-mode', mode);
            localStorage.setItem('stagewell-mode', mode);
        },

        setTheme(themeId) {
            this.currentTheme = themeId;
            document.documentElement.setAttribute('data-theme', themeId);
            localStorage.setItem('stagewell-theme', themeId);
        },

        // Auth methods
        async signInWithGoogle() {
            this.loading = true;
            const { error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/' + pageName + '.html'
                }
            });
            this.loading = false;
            if (error) alert(error.message);
        },

        async signInWithMagicLink() {
            if (!this.loginEmail) return;
            this.loading = true;
            const { error } = await supabaseClient.auth.signInWithOtp({
                email: this.loginEmail,
                options: {
                    emailRedirectTo: window.location.href
                }
            });
            this.loading = false;
            if (error) {
                alert(error.message);
            } else {
                this.emailSent = true;
            }
        },

        async signOut() {
            await supabaseClient.auth.signOut();
            this.session = null;
            this.userEmail = '';
        },

        // Base init (call super in page-specific init)
        async initShared() {
            const { data: { session } } = await supabaseClient.auth.getSession();
            this.session = session;
            if (session) {
                this.userEmail = session.user.email;
            }

            supabaseClient.auth.onAuthStateChange(async (_event, session) => {
                this.session = session;
                if (session) {
                    this.userEmail = session.user.email;
                }
            });
        }
    };
}

// ===========================================
// HELPER: Render sidebar and header into page
// ===========================================
function renderSharedComponents(pageName, headerTitle, headerSubtitle) {
    // Render sidebar
    const sidebarContainer = document.getElementById('shared-sidebar');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = generateSidebar(pageName);
    }

    // Render header
    const headerContainer = document.getElementById('shared-header');
    if (headerContainer) {
        headerContainer.innerHTML = generateHeader(headerTitle, headerSubtitle);
    }
}
