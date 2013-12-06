/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

// focus-effects: Apply effects on window focus/blur

// Copyright (C) 2011 Florian Mounier aka paradoxxxzero

// This program is free software: you can redistribute it and/or m odify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// Author: Florian Mounier aka paradoxxxzero

const Clutter = imports.gi.Clutter;
const GLib = imports.gi.GLib;
const Lang = imports.lang;
const Shell = imports.gi.Shell;
const St = imports.gi.St;

const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const Panel = imports.ui.panel;
const PanelMenu = imports.ui.panelMenu;
const Tweener = imports.ui.tweener;

let tracker, app_system, focus_connection, animations, shader;

function update () {
    let running = app_system.get_running();
    for(var i = 0; i < running.length; i++) {
        let windows = running[i].get_windows();
        for(var j = 0; j < windows.length; j++) {
            let actor = windows[j].get_compositor_private();
            if(actor) {
                if (!actor.get_effect('shader')) {
                    let fx = new Clutter.ShaderEffect(
                        { shader_type: Clutter.ShaderType.FRAGMENT_SHADER }
                    );
                    fx.set_shader_source(shader);
                    fx.set_uniform_value('height', actor.get_height());
                    fx.set_uniform_value('width', actor.get_width());
                    actor.add_effect_with_name('shader', fx);
                    let sizechanged = function () {
                                          fx.set_uniform_value('height', actor.get_height());
                                          fx.set_uniform_value('width', actor.get_width());
                                      };
                    actor.connect('size-changed', sizechanged);
                }
            }
        }
    }
}

function enable() {
    try {
        shader = Shell.get_file_contents_utf8_sync('.shader.glsl');
    } catch (e) {
        shader = null;
    }
    if(shader) {
        update();
        focus_connection = tracker.connect('notify::focus-app', update);
    }
}


function init() {
    tracker = Shell.WindowTracker.get_default();
    app_system = Shell.AppSystem.get_default();
}


function disable() {
    let running = app_system.get_running();
    for(var i = 0; i < running.length; i++) {
        let windows = running[i].get_windows();
        for(var j = 0; j < windows.length; j++) {
            windows[j].get_compositor_private().remove_effect_by_name('shader');
        }
    }
    tracker.disconnect(focus_connection);
}
