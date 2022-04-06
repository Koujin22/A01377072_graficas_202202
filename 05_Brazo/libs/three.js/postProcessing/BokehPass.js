import {
	Color,
	MeshDepthMaterial,
	NearestFilter,
	NoBlending,
	RGBADepthPacking,
	ShaderMaterial,
	UniformsUtils,
	WebGLRenderTarget
} from 'three';
import { Pass, FullScreenQuad } from './Pass.js';
import { BokehShader } from '../shaders/BokehShader.js';

/**
 * Depth-of-field post-process with bokeh shader
 */

class BokehPass extends Pass {

	constructor( scene, camara, params ) {

		super();

		this.scene = scene;
		this.camara = camara;

		const focus = ( params.focus !== undefined ) ? params.focus : 1.0;
		const aspect = ( params.aspect !== undefined ) ? params.aspect : camara.aspect;
		const aperture = ( params.aperture !== undefined ) ? params.aperture : 0.025;
		const maxblur = ( params.maxblur !== undefined ) ? params.maxblur : 1.0;

		// render targets

		const width = params.width || window.innerWidth || 1;
		const height = params.height || window.innerHeight || 1;

		this.renderTargetDepth = new WebGLRenderTarget( width, height, {
			minFilter: NearestFilter,
			magFilter: NearestFilter
		} );

		this.renderTargetDepth.texture.name = 'BokehPass.depth';

		// depth material

		this.materialDepth = new MeshDepthMaterial();
		this.materialDepth.depthPacking = RGBADepthPacking;
		this.materialDepth.blending = NoBlending;

		// bokeh material

		if ( BokehShader === undefined ) {

			console.error( 'THREE.BokehPass relies on BokehShader' );

		}

		const bokehShader = BokehShader;
		const bokehUniforms = UniformsUtils.clone( bokehShader.uniforms );

		bokehUniforms[ 'tDepth' ].value = this.renderTargetDepth.texture;

		bokehUniforms[ 'focus' ].value = focus;
		bokehUniforms[ 'aspect' ].value = aspect;
		bokehUniforms[ 'aperture' ].value = aperture;
		bokehUniforms[ 'maxblur' ].value = maxblur;
		bokehUniforms[ 'nearClip' ].value = camara.near;
		bokehUniforms[ 'farClip' ].value = camara.far;

		this.materialBokeh = new ShaderMaterial( {
			defines: Object.assign( {}, bokehShader.defines ),
			uniforms: bokehUniforms,
			vertexShader: bokehShader.vertexShader,
			fragmentShader: bokehShader.fragmentShader
		} );

		this.uniforms = bokehUniforms;
		this.needsSwap = false;

		this.fsQuad = new FullScreenQuad( this.materialBokeh );

		this._oldClearColor = new Color();

	}

	render( renderer, writeBuffer, readBuffer/*, deltaTime, maskActive*/ ) {

		// Render depth into texture

		this.scene.overrideMaterial = this.materialDepth;

		renderer.getClearColor( this._oldClearColor );
		const oldClearAlpha = renderer.getClearAlpha();
		const oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		renderer.setClearColor( 0xffffff );
		renderer.setClearAlpha( 1.0 );
		renderer.setRenderTarget( this.renderTargetDepth );
		renderer.clear();
		renderer.render( this.scene, this.camara );

		// Render bokeh composite

		this.uniforms[ 'tColor' ].value = readBuffer.texture;
		this.uniforms[ 'nearClip' ].value = this.camara.near;
		this.uniforms[ 'farClip' ].value = this.camara.far;

		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			this.fsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( writeBuffer );
			renderer.clear();
			this.fsQuad.render( renderer );

		}

		this.scene.overrideMaterial = null;
		renderer.setClearColor( this._oldClearColor );
		renderer.setClearAlpha( oldClearAlpha );
		renderer.autoClear = oldAutoClear;

	}

}

export { BokehPass };
