import * as React from "react";
import { DiagramEngine } from "../../DiagramEngine";
import * as _ from "lodash";
import { NodeWidget } from "../NodeWidget";
import { NodeModel } from "../../models/NodeModel";
import { BaseWidget, BaseWidgetProps } from "../BaseWidget";

export interface NodeLayerProps extends BaseWidgetProps {
	diagramEngine: DiagramEngine;
}

export interface NodeLayerState {}

export class RenderNodes extends BaseWidget<NodeLayerProps, NodeLayerState> {
	
	constructor(props: NodeLayerProps) {
		super("srd-node-layer", props);
		this.state = {};
	}

	shouldComponentUpdate() {
		return this.props.diagramEngine.hasRepaint();
	}

	updateNodeDimensions = () => {
		if (!this.props.diagramEngine.nodesRendered) {
			const diagramModel = this.props.diagramEngine.getDiagramModel();
			_.map(diagramModel.getNodes(), node => {
				node.updateDimensions(this.props.diagramEngine.getNodeDimensions(node));
			});
		}
	};

	componentDidUpdate() {
		this.updateNodeDimensions();
		this.props.diagramEngine.nodesRendered = true;
	}

	render() {
		var diagramModel = this.props.diagramEngine.getDiagramModel();

		return <React.Fragment>
				{_.map(diagramModel.getNodes(), (node: NodeModel) => {
					return React.createElement(
						NodeWidget,
						{
							diagramEngine: this.props.diagramEngine,
							key: node.id,
							node: node
						},
						this.props.diagramEngine.generateWidgetForNode(node)
					);
				})}
		</React.Fragment>
	}
}
